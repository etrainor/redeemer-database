'use strict';

// Manage Application Environment Variables
require('dotenv').config();

// Application Dependencies
const express = require('express');
const pg = require('pg');
//TODO: remove superagent if not ultimately using
// const superagent = require('superagent');
const methodOverride = require('method-override');

// Application Setup
const app = express();
const PORT = process.env.PORT;

// Database Client Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Application Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handle HTML Form PUT/DELETE
app.use(
  methodOverride((request, response) => {
    if (
      request.body &&
      typeof request.body === 'object' &&
      '_method' in request.body
    ) {
      // look in urlencoded POST bodies and delete it
      let method = request.body._method;
      delete request.body._method;
      return method;
    }
  })
);

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// API Routes
app.get('/', homePage);
app.get('/all_churches', allChurches);
app.get('/all_pastors', allPastors);
app.get('/all_meetings', allMeetings);
app.get('/all_prayers', allPrayers);
app.get('/add', addSelection);
app.get('/church/:id', getSingleChurch);
app.get('/pastor/:id', getSinglePastor);
app.get('/meeting/:id', getSingleMeeting);
app.get('/print_report/:id', getSingleReport);
app.post('/new-church', addChurch);
app.post('/new-pastor', addPastor);
app.post('/new-minutes', addMinutes);
app.post('/new-prayer', addPrayer);
app.post('/new-update', addPrayerUpdate);
app.delete('/church/:id', deleteRecord);
app.delete('/pastor/:id', deleteRecord);
app.delete('/meeting/:id', deleteRecord);
app.delete('/prayer/:id', deleteRecord);
app.delete('/prayer-update/:id', deleteRecord);
app.put('/pastor/edit/:id', updateRecord);
app.put('/church/edit/:id', updateRecord);

//Error Page
app.get('*', (request, response) => response.status(404).render('pages/404'));

// Turn the server On
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// app.get('*', (request, response) => response.status(404).send(
//   '<body style="background-color: black; display: flex; flex-direction: row; justify-content: center; align-content: center;"><img style="height: 50vw;" src="https://miro.medium.com/max/1081/1*VYPlqLaosLszAtKlx5fHzg.jpeg"/></body>'));

function getSingleChurch(request, response) {
  let SQL = 'SELECT * FROM churches WHERE id=$1;';
  let values = [request.params.id];
  // console.log(values, 'church values');
  client
    .query(SQL, values)
    .then(result => {
      // console.log(result.rows[0], 'church-result');
      // console.log(new GetChurch(result.rows[0]), 'church.rows');
      response.render('pages/show_single_church', {
        church: new GetChurch(result.rows[0])
      });
    })
    .catch(err => handleError(err, response));
}

function getSinglePastor(request, response) {
  getChurchList()
    .then(churches => {
      let SQL =
        'SELECT pastors.*, churches.name, churches.location FROM pastors INNER JOIN churches on pastors.church_id = churches.id WHERE pastors.id=$1;';
      let values = [request.params.id];
      client
        .query(SQL, values)
        .then(result => {
          let church = churches.rows.find(
            church => church.id === parseInt(result.rows[0].church_id)
          );

          response.render('pages/show_single_pastor', {
            pastor: new GetPastor(result.rows[0]),
            churches: churches.rows,
            church: church
          });
        })
        .catch(err => handleError(err, response));
    })
    .catch(err => handleError(err, response));
}

function getSingleMeeting(request, response) {
  getChurchesWithPastors()
    .then(churchPastorData => {
      let SQL = 'SELECT * FROM meetings WHERE id=$1;';
      let values = [request.params.id];
      client
        .query(SQL, values)
        .then(result => {
          // console.log(result, 'meeting results');
          let reports = JSON.parse(
            new GetMinutes(result.rows[0]).church_reports
          ).church_reports;
          // console.log(
          //   new GetMinutes(result.rows[0]).general_notes,
          //   'gen notes'
          // );
          response.render('pages/show_single_meeting', {
            meeting: new GetMinutes(result.rows[0]),
            churchPastorData: churchPastorData.rows,
            churchReports: reports
          });
        })
        .catch(err => handleError(err, response));
    })
    .catch(err => handleError(err, response));
}

function getSingleReport(request, response) {
  getChurchesWithPastors()
    .then(churchPastorData => {
      let SQL = 'SELECT * FROM meetings WHERE id=$1;';
      let values = [request.params.id];
      client
        .query(SQL, values)
        .then(result => {
          // console.log(result, 'meeting results');
          let reports = JSON.parse(
            new GetMinutes(result.rows[0]).church_reports
          ).church_reports;
          // console.log(
          //   new GetMinutes(result.rows[0]).general_notes,
          //   'gen notes'
          // );
          response.render('pages/print_report', {
            meeting: new GetMinutes(result.rows[0]),
            churchPastorData: churchPastorData.rows,
            churchReports: reports
          });
        })
        .catch(err => handleError(err, response));
    })
    .catch(err => handleError(err, response));
}

// HELPER FUNCTIONS

function getPrayerArray(obj) {
  let allPrayerRequests = [];
  for (const key of Object.keys(obj)) {
    if (key.includes('prayer_requests')) {
      let tempArray = obj[key];
      allPrayerRequests.push(tempArray);
    }
  }
  return allPrayerRequests;
}

function dayOfWeek(input) {
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  let dayOfTheWeek = days[new Date(input).getDay()];

  return dayOfTheWeek;
}

function formatDate(input) {
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  let month = months[new Date(input).getMonth()];
  let day = new Date(input).getDate();
  let year = new Date(input).getFullYear();

  let formattedDate = `${month} ${day}, ${year}`;
  return formattedDate;
}
/**
 * @function formatHours(date)
 * Function that formats the hours using the javascript date.getHours method.
 * Adds a zero to hours output if the hour is less than 10.
 * @param  {} date
 * @return string
 */
function formatHours(date) {
  let hours = date.getHours();
  let formattedHour = hours;
  if (hours < 10) {
    formattedHour = `0${hours}`;
  }
  return formattedHour;
}
/**
 *
 * @function formatMinutes(date)
 * @param  {} date
 * @param  {} {letminutes=date.getMinutes(
 * @param  {} ;letformattedMinutes=minutes;if(formattedMinutes<10
 */
function formatMinutes(date) {
  let minutes = date.getMinutes();
  let formattedMinutes = minutes;
  if (formattedMinutes < 10) {
    formattedMinutes = `0${minutes}`;
  }
  return formattedMinutes;
}

function formatSeconds(date) {
  let seconds = date.getSeconds();
  let formattedSeconds = seconds;
  if (formattedSeconds < 10) {
    formattedSeconds = `0${seconds}`;
  }
  return formattedSeconds;
}

function convertToDate(date) {
  let convertedDate = new Date(Date.parse(date));
  return convertedDate;
}

function timestamp(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = formatHours(date);
  let minutes = formatMinutes(date);
  let seconds = formatSeconds(date);
  let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

function formatReports(input) {
  let churchReportsArray = [];

  for (let i = 0; i < input.church_id.length; i++) {
    input.church_id[i] = {
      church_id: input.church_id[i],
      church_name: input.church_name[i],
      church_pastor: input.church_pastor[i],
      report: formatTextboxes(input.report[i]),
      prayerRequests: getPrayerArray(input)[i]
    };
    churchReportsArray.push(input.church_id[i]);
  }
  return churchReportsArray;
}

// Removes curly brackets from the begining and end of string and turns the string into an array to format church report as required when database is queried.
function formatChurchReport(str) {
  let reportStr = str.slice(1, -1);
  let reportArray = reportStr.split(',');

  return reportArray;
}

function formatReportsOnOutput(input) {
  let churchReportsArray = [];

  for (let i = 0; i < input.church_reports.church_reports.length; i++) {
    input.church_reports.church_reports[i].church_id = {
      church_id: input.church_reports.church_reports[i].church_id,
      church_name: input.church_reports.church_reports[i].church_name,
      church_pastor: input.church_reports.church_reports[i].church_pastor,
      report: formatTextboxOnOutput(
        formatChurchReport(input.church_reports.church_reports[i].report)
      ),
      prayerRequests: input.church_reports.church_reports[i].prayerRequests
    };

    churchReportsArray.push(input.church_reports.church_reports[i].church_id);
  }
  return churchReportsArray;
}
//Prayer Request Constructor
function Prayer(input) {
  this.date = JSON.stringify(timestamp(convertToDate(input.date)));
  this.prayer = formatTextboxes(input.prayer);
}

function PrayersOutput(prayerInput, commentsInput) {
  this.prayer_id = prayerInput.id;
  this.date = formatDate(prayerInput.date);
  this.prayer = formatTextboxOnOutput(prayerInput.prayer);
  this.comments = [];
  //TODO: remove the comments placeholder
  for (let i = 0; i < commentsInput.length; i++) {
    if (commentsInput[i].prayer_id === prayerInput.id) {
      // console.log('i found you');
      // let hi = commentsInput[i].comment.join('<br>');
      // console.log(hi);
      // console.log(formatTextboxOnOutput(commentsInput[i].comment));
      this.comments.push({
        id: commentsInput[i].id,
        date: formatDate(commentsInput[i].date),
        update: commentsInput[i].comment
      });
    }
  }
}

//Prayer Update Constructor
function UpdatePrayer(input) {
  this.date = JSON.stringify(timestamp(convertToDate(input.date)));
  this.comment = formatTextboxes(input.comment);
  this.prayer_id = input.prayer_id;
}

//Meeting Minutes Constructor
function Minutes(input) {
  let startJSON = '{"church_reports":';
  let endJSON = '}';
  this.date = input.date;
  this.formatted_date = formatDate(input.date);
  this.day = dayOfWeek(input.date);
  this.start_time = input.start_time;
  this.end_time = input.end_time;
  this.venue = input.venue;
  this.meeting_host = input.meeting_host;
  this.presiding_officer = input.presiding_officer;
  this.agenda = formatTextboxes(input.agenda);
  this.minutes_taken_by = input.minutes_taken_by;
  this.attendees = input.attendees;
  this.opening_prayer_by = input.opening_prayer_by;
  this.gods_message_by = input.gods_message_by;
  this.general_notes = formatTextboxes(input.general_notes);
  //TODO: Can I make this JSON without the ugly concatenation?
  this.church_reports =
    startJSON + JSON.stringify(formatReports(input)) + endJSON;
  this.other_matters = input.other_matters;
  this.next_meeting = input.next_meeting;
  this.next_meeting_formatted = formatDate(input.next_meeting);
  this.next_meeting_day = dayOfWeek(input.next_meeting);
  this.next_time = input.next_time;
  this.next_location = input.next_location;
  this.next_location_host = input.next_location_host;
  this.closing_prayer_by = input.closing_prayer_by;
}

//Constructor that formats the pastor data after getting it from the database. Needed to manipulate punctuation of text boxes for user readability.
function GetMinutes(input) {
  let startJSON = '{"church_reports":';
  let endJSON = '}';
  this.id = input.id;
  this.date = input.date;
  this.formatted_date = formatDate(input.date);
  this.day = dayOfWeek(input.date);
  this.start_time = input.start_time;
  this.end_time = input.end_time;
  this.venue = input.venue;
  this.meeting_host = input.meeting_host;
  this.presiding_officer = input.presiding_officer;
  this.agenda = formatTextboxOnOutput(input.agenda);
  this.minutes_taken_by = input.minutes_taken_by;
  this.attendees = input.attendees;
  this.opening_prayer_by = input.opening_prayer_by;
  this.gods_message_by = input.gods_message_by;
  this.general_notes = formatTextboxOnOutput(
    formatChurchReport(input.general_notes)
  );
  //TODO: Can I make this JSON without the ugly concatenation?
  this.church_reports =
    startJSON + JSON.stringify(formatReportsOnOutput(input)) + endJSON;
  this.other_matters = input.other_matters;
  this.next_meeting = input.next_meeting;
  this.next_meeting_formatted = formatDate(input.next_meeting);
  this.next_meeting_day = dayOfWeek(input.next_meeting);
  this.next_time = input.next_time;
  this.next_location = input.next_location;
  this.next_location_host = input.next_location_host;
  this.closing_prayer_by = input.closing_prayer_by;
}

// Pastors Constructor
function Pastor(input) {
  this.pastor_first_name = input.pastor_first_name;
  this.pastor_last_name = input.pastor_last_name;
  this.spouse = input.spouse;
  this.pastor_story = formatTextboxes(input.pastor_story);
  this.spouse_story = formatTextboxes(input.spouse_story);
  this.image_url = input.image_url;
  this.family_marriage = formatTextboxes(input.family_marriage);
  this.prayer_needs = formatTextboxes(input.prayer_needs);
  this.church_id = input.church_id;
}

//Constructor that formats the pastor data after getting it from the database. Needed to manipulate punctuation of text boxes for user readability.
function GetPastor(input) {
  this.id = input.id;
  this.pastor_first_name = input.pastor_first_name;
  this.pastor_last_name = input.pastor_last_name;
  this.spouse = input.spouse;
  this.pastor_story = formatTextboxOnOutput(input.pastor_story);
  this.spouse_story = formatTextboxOnOutput(input.spouse_story);
  this.image_url = input.image_url;
  this.family_marriage = formatTextboxOnOutput(input.family_marriage);
  this.prayer_needs = formatTextboxOnOutput(input.prayer_needs);
  this.church_id = input.church_id;
}

// Churches Constructor
function Church(input) {
  this.name = input.name;
  this.map_url = `https://maps.googleapis.com/maps/api/staticmap?center=${input.latitude}%2c%20${input.longitude}&zoom=8&size=400x400&markers=size:medium%7Ccolor:BE5347%7C${input.latitude},${input.longitude}&maptype=hybrid&key=${process.env.GEOCODE_API_KEY}`;
  this.longitude = input.longitude;
  this.latitude = input.latitude;
  this.location = input.location;
  this.church_members = input.church_members;
  this.sunday_school = input.sunday_school;
  this.pre_school = input.pre_school;
  this.feeding_program = input.feeding_program;
  this.description = formatTextboxes(input.description);
  this.community = formatTextboxes(input.community);
}

//Constructor that formats the church data after getting it from the database. Needed to manipulate punctuation of text boxes for user readability.

function GetChurch(input) {
  this.id = input.id;
  this.name = input.name;
  this.map_url = input.map_url;
  this.longitude = input.longitude;
  this.latitude = input.latitude;
  this.location = input.location;
  this.church_members = input.church_members;
  this.sunday_school = input.sunday_school;
  this.pre_school = input.pre_school;
  this.feeding_program = input.feeding_program;
  this.description = formatTextboxOnOutput(input.description);
  this.community = formatTextboxOnOutput(input.community);
}
function formatTextboxOnOutput(arr) {
  let newArray = [];
  const comma = /7777777/g;
  const commaReplacement = ',';
  const doubleQuote = /8888888/g;
  const doubleQuoteReplacement = '"';
  for (let i = 0; i < arr.length; i++) {
    let firstReplace = arr[i].replace(comma, commaReplacement);
    let secondReplace = firstReplace.replace(
      doubleQuote,
      doubleQuoteReplacement
    );
    newArray.push(secondReplace);
  }
  return newArray;
}

function formatTextboxes(string) {
  const lineBreak = /\r\n\r\n/g;
  const lineBreakReplacement = ', ';
  const comma = /,/g;
  const commaReplacement = '7777777';
  const doubleQuote = /"/g;
  const doubleQuoteReplacement = '8888888';
  let tempString1 = string.replace(comma, commaReplacement);
  let tempString2 = tempString1.replace(doubleQuote, doubleQuoteReplacement);
  let convertedString = tempString2.replace(lineBreak, lineBreakReplacement);
  return `{${convertedString}}`;
}
function getPath(request, response) {
  let currentPath = request.path;
  // console.log(currentPath);
  let regex = /\/(.*?)\//;
  let path = currentPath.match(regex);
  return path[1];
}

// Retrieve churches from database
function getChurchList() {
  let SQL = 'SELECT DISTINCT id, name, location FROM churches ORDER BY name;';

  return client.query(SQL);
}

//Retrieve pastors plus churches from database

function getChurchesWithPastors() {
  let SQL =
    'SELECT pastors.pastor_first_name, pastors.pastor_last_name, pastors.church_id, churches.name, churches.location FROM pastors INNER JOIN churches on pastors.church_id = churches.id;';

  return client.query(SQL);
}

// Home Page
function homePage(request, response) {
  response.render('pages/index');
}

// TODO: Can allChurches, allMeetings, and allPastors be made into 1 function?
function allChurches(request, response) {
  let SQL = 'SELECT * FROM churches ORDER BY name ASC;';
  return client
    .query(SQL)
    .then(results => {
      if (results.rows.rowCount === 0) {
        response.render('pages/add');
      } else {
        response.render('pages/all_churches', { churches: results.rows });
      }
    })
    .catch(err => handleError(err, response));
}

function formatAllPrayersArray(prayers, comments) {
  let allPrayersArray = [];
  for (let i = 0; i < prayers.length; i++) {
    let prayerInfo = new PrayersOutput(prayers[i], comments);
    console.log(prayerInfo, 'formatAllPrayers');
    allPrayersArray.push(prayerInfo);
  }
  return allPrayersArray;
}

function getAllPrayerUpdates(request, response) {
  let SQL = 'SELECT * FROM comments ORDER BY id ASC;';
  return client.query(SQL).then(results => {
    let prayerComments = results.rows;
    console.log(
      prayerComments[0].id,
      'prayer comments from getAllPrayerUpdates'
    );
    return prayerComments;
  });
}
function allPrayers(request, response) {
  getAllPrayerUpdates().then(comments => {
    // console.log(comments, '??????????');
    let SQL = 'SELECT * FROM prayers ORDER BY date ASC;';
    return client
      .query(SQL)
      .then(results => {
        let prayers = formatAllPrayersArray(results.rows, comments);
        console.log(prayers, 'SQL prayers query');
        response.render('pages/prayer-requests', { prayers: prayers });
      })
      .catch(err => handleError(err, response));
  });
}

function allMeetings(request, response) {
  let SQL = 'SELECT * FROM meetings ORDER BY id ASC;';
  return client
    .query(SQL)
    .then(results => {
      if (results.rows.rowCount === 0) {
        response.render('pages/add');
      } else {
        response.render('pages/all_meetings', { meetings: results.rows });
      }
    })
    .catch(err => handleError(err, response));
}

function allPastors(request, response) {
  let SQL =
    'SELECT pastors.id, pastors.pastor_first_name, pastors.pastor_last_name, pastors.spouse, pastors.pastor_story, pastors.spouse_story, pastors.image_url, pastors.family_marriage, pastors.prayer_needs, pastors.church_id, churches.name, churches.location FROM pastors LEFT JOIN churches ON pastors.church_id = churches.id ORDER BY pastor_last_name ASC;';

  return client
    .query(SQL)
    .then(results => {
      if (results.rows.rowCount === 0) {
        response.render('pages/add');
      } else {
        response.render('pages/all_pastors', { pastors: results.rows });
      }
    })
    .catch(err => handleError(err, response));
}

function addSelection(request, response) {
  getChurchList()
    .then(result => {
      getChurchesWithPastors()
        .then(churchList => {
          response.render('pages/add', {
            churchList: churchList.rows,
            distinctChurches: result.rows
          });
        })
        .catch(err => handleError(err, response));
    })
    .catch(err => handleError(err, response));
}

function addChurch(request, response) {
  // console.log(request.body, 'request.body for addChurch');
  let church = new Church(request.body);
  // console.log(church, 'church after constructor');

  let SQL =
    'INSERT INTO churches(name, longitude, latitude, map_url, location, church_members, sunday_school, pre_school, feeding_program, description, community) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id;';

  let values = [
    church.name,
    church.longitude,
    church.latitude,
    church.map_url,
    church.location,
    church.church_members,
    church.sunday_school,
    church.pre_school,
    church.feeding_program,
    church.description,
    church.community
  ];

  client
    .query(SQL, values)
    .then(result => {
      response.redirect(`/church/${result.rows[0].id}`);
    })
    .catch(err => handleError(err, response));
}

function addPrayer(request, response) {
  let prayer = new Prayer(request.body);

  let SQL = 'INSERT INTO prayers (date, prayer) VALUES($1, $2) RETURNING id';
  let values = [prayer.date, prayer.prayer];
  client
    .query(SQL, values)
    .then(result => {
      console.log('this prayer was added to database:', result);
      response.redirect('/all_prayers');
    })
    .catch(err => handleError(err, response));
}

function addPrayerUpdate(request, response) {
  let prayerUpdate = new UpdatePrayer(request.body);

  let SQL =
    'INSERT INTO comments (date, comment, prayer_id) VALUES($1, $2, $3)';

  let values = [
    prayerUpdate.date,
    prayerUpdate.comment,
    prayerUpdate.prayer_id
  ];

  client.query(SQL, values).then(result => {
    // console.log(result, 'what is this?');
    response.redirect('/all_prayers');
  });
}
function addPastor(request, response) {
  let pastor = new Pastor(request.body);

  let SQL =
    'INSERT INTO pastors (pastor_first_name, pastor_last_name, spouse, pastor_story, spouse_story, image_url, family_marriage, prayer_needs, church_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;';

  let values = [
    pastor.pastor_first_name,
    pastor.pastor_last_name,
    pastor.spouse,
    pastor.pastor_story,
    pastor.spouse_story,
    pastor.image_url,
    pastor.family_marriage,
    pastor.prayer_needs,
    pastor.church_id
  ];

  client
    .query(SQL, values)
    .then(result => {
      response.redirect(`/pastor/${result.rows[0].id}`);
    })
    .catch(err => handleError(err, response));
}

function addMinutes(request, response) {
  let minutes = new Minutes(request.body);
  // console.log(minutes, 'what does reports looks like?');

  let SQL =
    'INSERT INTO meetings (date, day, formatted_date, start_time, end_time, venue, meeting_host, presiding_officer, agenda, minutes_taken_by, attendees, opening_prayer_by, gods_message_by, general_notes, church_reports, other_matters, next_meeting, next_meeting_formatted, next_meeting_day, next_time, next_location, next_location_host, closing_prayer_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING id;';

  let values = [
    minutes.date,
    minutes.day,
    minutes.formatted_date,
    minutes.start_time,
    minutes.end_time,
    minutes.venue,
    minutes.meeting_host,
    minutes.presiding_officer,
    minutes.agenda,
    minutes.minutes_taken_by,
    minutes.attendees,
    minutes.opening_prayer_by,
    minutes.gods_message_by,
    minutes.general_notes,
    minutes.church_reports,
    minutes.other_matters,
    minutes.next_meeting,
    minutes.next_meeting_formatted,
    minutes.next_meeting_day,
    minutes.next_time,
    minutes.next_location,
    minutes.next_location_host,
    minutes.closing_prayer_by
  ];

  client
    .query(SQL, values)
    .then(result => {
      // console.log(result.rows[0].id, "result");
      response.redirect(`/meeting/${result.rows[0].id}`);
    })
    .catch(err => handleError(err, response));
}

// Update a single church or pastor
function updateRecord(request, response) {
  let path = getPath(request, response);
  function getQueryInfo() {
    if (path === 'pastor') {
      let pastor = new Pastor(request.body);
      let SQL = `UPDATE pastors SET pastor_first_name=$1, pastor_last_name=$2, spouse=$3, pastor_story=$4, spouse_story=$5, image_url=$6, family_marriage=$7, prayer_needs=$8, church_id=$9 WHERE id=$10;`;

      let values = [
        pastor.pastor_first_name,
        pastor.pastor_last_name,
        pastor.spouse,
        pastor.pastor_story,
        pastor.spouse_story,
        pastor.image_url,
        pastor.family_marriage,
        pastor.prayer_needs,
        pastor.church_id,
        request.params.id
      ];

      let pastorUpdate = [pastor, SQL, values];
      return pastorUpdate;
    } else if (path === 'church') {
      let church = new Church(request.body);
      let SQL = `UPDATE churches SET name=$1, map_url=$2, longitude=$3, latitude=$4, location=$5, church_members=$6, sunday_school=$7, pre_school=$8, feeding_program=$9, description=$10, community=$11 WHERE id=$12;`;

      let values = [
        church.name,
        church.map_url,
        church.longitude,
        church.latitude,
        church.location,
        church.church_members,
        church.sunday_school,
        church.pre_school,
        church.feeding_program,
        church.description,
        church.community,
        request.params.id
      ];

      let churchUpdate = [church, SQL, values];
      return churchUpdate;
    }
  }
  let updateInfo = getQueryInfo();

  return client
    .query(updateInfo[1], updateInfo[2])
    .then(response.redirect(`/${path}/${request.params.id}`))
    .catch(err => handleError(err, response));
}

// }
function deleteRecord(request, response) {
  function getDatabase(path) {
    if (path === 'church') {
      table = 'churches';
    } else if (path === 'pastor') {
      table = 'pastors';
    } else if (path === 'meeting') {
      table = 'meetings';
    } else if (path === 'prayer') {
      table = 'prayers';
    } else if (path === 'prayer-update') {
      table = 'comments';
    }
    return table;
  }
  let table = '';

  let current = getDatabase(getPath(request, response));

  let SQL = `DELETE FROM ${current} WHERE id=$1;`;

  let values = [request.params.id];
  // console.log(values);
  return client
    .query(SQL, values)
    .then(() => {
      if (current === 'comments') {
        current = 'prayers';
      }
      response.redirect(`/all_${current}`);
    })

    .catch(err => handleError(err, response));
}

// Error Handlers
function handleError(error, response) {
  response.render('pages/error', { error: error });
}
