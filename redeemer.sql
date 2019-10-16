DROP TABLE IF EXISTS pastors, churches, meetings, prayers, comments;

CREATE TABLE IF NOT EXISTS prayers (
  id SERIAL PRIMARY KEY,
  date DATE,
  prayer TEXT[]
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  date DATE,
  comment TEXT[],
  prayer_id INT REFERENCES prayers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS churches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  map_url VARCHAR(500),
  longitude NUMERIC,
  latitude NUMERIC,
  location TEXT,
  church_members VARCHAR(255),
  sunday_school VARCHAR(255),
  pre_school VARCHAR(255),
  feeding_program VARCHAR(255),
  description TEXT[],
  community TEXT[]
);

CREATE TABLE IF NOT EXISTS pastors (
  id SERIAL PRIMARY KEY,
  pastor_first_name VARCHAR(255),
  pastor_last_name VARCHAR(255),
  spouse VARCHAR(255),
  pastor_story TEXT[],
  spouse_story TEXT[],
  image_url VARCHAR(500),
  family_marriage TEXT[],
  prayer_needs TEXT[],
  church_id INT REFERENCES churches(id)
);

CREATE TABLE IF NOT EXISTS meetings (
  id SERIAL PRIMARY KEY,
  date VARCHAR(255),
  formatted_date VARCHAR(255),
  day VARCHAR(255),
  start_time VARCHAR(255),
  end_time VARCHAR(255),
  venue VARCHAR(255),
  meeting_host VARCHAR(255),
  presiding_officer VARCHAR(255),
  agenda TEXT[],
  minutes_taken_by VARCHAR(255),
  attendees TEXT[],
  opening_prayer_by VARCHAR(255),
  gods_message_by VARCHAR(255),
  general_notes TEXT,
  church_reports JSON,
  other_matters TEXT[],
  next_meeting VARCHAR(255),
  next_meeting_formatted VARCHAR(255),
  next_meeting_day VARCHAR(255),
  next_time VARCHAR(255),
  next_location VARCHAR(255),
  next_location_host VARCHAR(255),
  closing_prayer_by VARCHAR(255)
);

INSERT INTO churches (name, map_url, longitude, latitude, location, church_members, sunday_school, pre_school, feeding_program, description, community) VALUES (
  'Unassigned',
  'https://via.placeholder.com/400',
  0.0000,
  0.0000,
  'Philippines',
  '0',
  '0',
  '0',
  'NA',
  ARRAY [''],
  ARRAY ['']
);

INSERT INTO churches (name, map_url, longitude, latitude, location, church_members, sunday_school, pre_school, feeding_program, description, community) VALUES (
  'Grace Baptist Church',
  'https://maps.googleapis.com/maps/api/staticmap?center=10.8001204%2c%20122.9719454&zoom=8&size=400x400&markers=size:medium%7Ccolor:red%7C10.8001204,122.9719454&maptype=hybrid&key=AIzaSyCYccqr8-Sor69gTESrIU8AJ2ubMnl6q_o',
  122.9719454,
  10.8001204,
  'Silay City, Negros Occidental',
  '89',
  '42',
  '73',
  'NA',
  ARRAY ['Not from surrounding community; very poor with very few having permanent jobs; a few teachers and small business owners; part time work construction and sugar cane fields.', 'Church owns building and parsonage on same property which provides home for family of Sharyl Antolo (Mom, Dad, and brother) and Jenny Jaya.','Noel currently provides leadership for the governments Moral Recovery Program aims to encourage individuals to develop good moral character. It promotes the importance of honesty, integrity and kindness. The program highlights how helping others in the community and beyond is important. Noel works closely with local govt. employees & police along with 16 other pastors; allows access to people and communities teaching Biblical principles.'],
  ARRAY ['Church members not from immediate community.', 'Sugar cane workers – many in slave relationships due to money borrowed from property owners.']
);

INSERT INTO churches (name, map_url, longitude, latitude, location, church_members, sunday_school, pre_school, feeding_program, description, community) VALUES (
  'Divine Grace Baptist Church',
  'https://maps.googleapis.com/maps/api/staticmap?center=10.8001204%2c%20122.9719454&zoom=8&size=400x400&markers=size:medium%7Ccolor:red%7C10.8001204,122.9719454&maptype=hybrid&key=AIzaSyCYccqr8-Sor69gTESrIU8AJ2ubMnl6q_o',
  122.9719454,
  10.8001204,
  'Silay City, Negros Occidental',
  '50',
  '70',
  '80',
  '25',
  ARRAY ['First church plant pastor in ROL Network', 'Planted two additional churches since 2007','Mentored by Pastor Noel Banasing'],
  ARRAY ['Sports ministry to the youth', 'Livelihood project for the mothers in the community']
);

INSERT INTO pastors (pastor_first_name, pastor_last_name, spouse, pastor_story, spouse_story, image_url, family_marriage, prayer_needs, church_id) VALUES (
  'Nemuel',
  'Caagoy',
  'Daisy',
  ARRAY ['Bacolod Fundamental Bible School'],
  ARRAY ['Bible college to “reform” rebellions & stubborn; housekeeper/nanny in Singapore & ministered to Muslim family; worked in sugar cane fields to support brother’s education', 'Grew up in community where now in ministry'],
  'https://i.imgur.com/IOf4BB1.png',
  ARRAY ['Met in Bible School', 'Two children: Dan Israel (2011) and Niel John (2014)'],
  ARRAY ['Income generating project; project team to help get this started', 'Preschool; parents of children & patience', 'Improvement in transportation logistics', 'Daisy desire for faithfulness, strength, wisdom, blessing to others', 'Health of sons', 'Financial struggles'],
  3
);

-- TODO: Figure out how to escape "" when inserting into PSQL
INSERT INTO pastors (pastor_first_name, pastor_last_name, spouse, pastor_story, spouse_story, image_url, family_marriage, prayer_needs, church_id) VALUES (
  'Noel',
  'Banasing',
  'Jackie',
  ARRAY ['Motivation is to serve; investing what you have in others; understanding challenge of pastors & their wives', 'accepted Jesus at age 14; no desire to pastor due to inability to support family but... if God calls...you cannot escape.'],
  ARRAY ['Raised in Christian family; passion for children & teaching; desired to be a pastor’s wife; attended Bible school with focus on children.', 'ICM – educates parents & training of teachers; development & establish pre- schools (95 currently).'],
  'https://i.imgur.com/nmIxExc.png',
  ARRAY ['Jackie & Noel met in Bible School; married in 1988. Jackie works as Consultant of Education at International Care Ministries (ICF) which provides family home. Two sons: NJ (Nosnhoj) living & working in Dubai', 'Jireh graduated college Spring 2017 in business mgmt. Daughter- Precious Grace, married to Stephen with three children (Demarius, Seth, Shamger) lives in Manila.', 'Noel traveled extensively with ICM 1993-2003; lack of family time; Left ICM to full time pastor with desire to help other pastors and mentor pastors; ICM focus on community development & Noel called to church planting; goal for R of L is to plant new church each year.'],
  ARRAY ['Jobs, ministry for sons Nosnhoj (1990) & Jireh (1991)', 'Early retirement approval for Jackie at age 55 ( in two years) work at ICM stressful', 'Relationship with children', 'Increasing of R of L network 1 to 2 churches per year; identify willing learners', 'Noel health: high BP & asthma', 'Jackie health: stroke in 2014; low BP; arthritis; impact of menopause; headaches & needed therapy for neck and shoulders', 'Desire to see more physical church buildings for R of L; financial needs exist for property purchase & materials'],
  2
);

INSERT INTO meetings (date, day, formatted_date, start_time, end_time, venue, meeting_host, presiding_officer, agenda, minutes_taken_by, attendees, opening_prayer_by, gods_message_by, general_notes, church_reports, other_matters, next_meeting, next_meeting_formatted, next_meeting_day, next_time, next_location, next_location_host, closing_prayer_by) VALUES (
  '1923-10-26',
  'Thursday',
  'October 26, 1923',
  '08:00 AM',
  '05:00 PM',
  'Disney Land',
  'Mickey Mouse',
  'Mickey Mouse',
  ARRAY ['plan the fireworks show', 'who is allowed to view the parade?', 'find a new source for cotton candy'],
  'Daisy Duck',
  ARRAY ['Mickey Mouse', 'Minnie Mouse', 'Donald Duck', 'Daisy Duck', 'Goofy', 'Pluto'],
  'Mickey Mouse',
  'Goofy',
  'Be careful around children... they bite!',
  '{"church_reports": [{"church_id": "3", "church_name":"Disney Enjoyment Fellowship Church", "church_pastor":"Mickey Mouse", "report": ["New park is opening next week"], "prayerRequests": ["Safety of guests", "Rides are fun", "People to manage", "Financial Success"]},{"church_id": "2", "church_name":"Pixar Baptist Church", "church_pastor":"Mr. Incredible", "report": ["We Exist!"], "prayerRequests": ["Make movies", "hire princesses", "candy", "buy Pixar"]}]}',
  ARRAY ['Cinderella needs a Castle', 'Tell Snow White not to eat the apple', 'Someone needs to wake up Sleeping Beauty'],
  '1924-10-26',
  'October 26, 1924',
  'Friday',
  '08:00 AM',
  'Walt Disney Headquarters',
  'Mr. Incredible',
  'Donald Duck'
);

INSERT INTO meetings (date, day, formatted_date, start_time, end_time, venue, meeting_host, presiding_officer, agenda, minutes_taken_by, attendees, opening_prayer_by, gods_message_by, general_notes, church_reports, other_matters, next_meeting, next_meeting_formatted, next_meeting_day, next_time, next_location, next_location_host, closing_prayer_by) VALUES (
  '2018-01-15',
  'Monday',
  'January 15, 2018',
  '09:00 AM',
  '02:00 PM',
  'God''s Word Baptist Church',
  'Pastor Marlon Ticar',
  'Pastor Noel Banasing',
  ARRAY ['Sharing and testimonies of every redeemer pastors', 'Hard copies of  December  accomplishment report submit it to Jenny, except the 4 new pastors, Pastor Richard Mahinay, Pastor Ronel Tarino, Pastor Benjie, Bernasol, Pastor Norman Gicaro', 'The final committees of our Men and Youth Fellowship every month'],
  'Jenny Jaya',
  ARRAY ['Pastor Nestor Vegafria', 'Pastor Richard Loquenario', 'Pastor Marlon Ticar', 'Pastor Romeo Delgado', 'Pastor Leo De Pedro', 'Pastor Rolly  Cadahing', 'Pastor Nemuel Caagoy', 'Pastor Florentino Alpas', 'Sharyl Antol', 'Jenny Jaya', 'Pastor Joseph Leonidas', 'Pastor Norman Gicaro', 'Pastor Richard Mahinay', 'Pastor Ronel Tarino', 'Pastor Benjie Bernasol', ''],
  'Pastor Noel Banasing',
  'Pastor Nemuel Caagoy',
  'After sharing God''s word Pastor Noel said: As usual we are submitting our written report before  our sharing and oral reports . Please give all your report to Jenny Jaya',
  -- TODO: update the church_id for seed data
  '{"church_reports": [{"church_id": "3", "church_name":"Moriah God’s Temple", "church_pastor":"Nestor Vegafria", "report": ["Praise God and so thankful to Him for His faithfulness to us , especially that God still using us to reach out the poor , the unsaved to become save. I am happy in serving the Lord despite hardship. I that God for the Redeemer of Life lead by pastor Banasing as our mentor in the ministry. Also, the Northshore Community church. Through their prayers and financial support, we were able to reach more souls and have programs in our church." , "With regards to the updates of the ministry in the mountain of course all of us as very busy to do our work , My bible studies are consistent 4 times a week and  we have two churches every week to handle , during Saturday we have worship in the mountain and Sunday here in the proper village, although it is hard but we enjoy doing it with my wife, because we know the Lord called us to do this work.", "We still extend feeding program although we have no funds, but God provided in some other ways through our church members donations of some small amount, the thing is that we have no consistent amount every Saturday. We just depend on how much we have from our church members.  But we are very happy to do this with sacrifice. We are still praying that God will resume the fund from Northshore for the feeding program so that we can help the very poor children in our community as well as the pre-school budget. My wife also extends thanks to Northshore for the Pre-school teacher love gift serve as allowance . It helps a lot to our very needs and for our students. Some we spend for the repair of our parsonage.", "By God’s Grace we continue our Pre-school by faith , this ministry is very effective because we can reach the parents through God’s word because of their children. Right now , we still have 52 students.  We are so thankful to the Team of Northshore headed by John Trainor the materials for the children is very  helpful to us."], "prayerRequests": ["God''s provision for our feeding program.", "Good health for me and for my wife", "Daily protection to do the work of the Lord", "Financial Success", "God''s provision for the pre-school."]},{"church_id": "2", "church_name":"Redeemer of Life Church", "church_pastor":" Romeo Delgado", "report": ["For me it is my privilege to share about my one whole month experience in the ministry of how the Lord is doing and helping the ministry going on smoothly .  I am so thankful to God for the Redeemer of Life being the shoulder of the ministry because it is very hard to be alone, I believe Redeemer is an Instrument of God so that this ministry will continue  and productive even though there are lots of trials. I thank God also for the Northshore Community Church who support us  in Prayers and of course financial it is a great help to our family personal needs since our church income is so little, that is why I am thankful also to Pastor Noel Banasing as our Leader and Mentor . Our Redeemer meeting and fellowship  for me is recharging because of our sharing of our experience in the ministry every month.", "With regards to the updates of the ministry , our regular schedule of bible studies still goes on 2 times a week and the whole month we did 8 Bible studies not including our  special schedule some  of the families requested us to have bibles studies  but not a regular schedule. Our regular church attendance for this month is 130 not including the children. Month of  December  we had 10 salvation lead to the Lord and we are now doing  discipleship for the 10 new converts.", "This year 2018, we are extending our new outreach in the upper village, we had already 5 families attending our service every week. We are hoping that the Lord will provide financially  for our feeding program into this remote area"], "prayerRequests": ["Please help us to pray that God will provide us a church lot for our church Gathering. Because the one that we are using until now the children of the owner wants to get it back, although the parents donated it to us but the problem the old ones who donated the lot has  died and they have no copy of deed of donation. Only the Lord knows, and we just rely on Him.", "Good health and financial needs for my family.", "We need additional materials for the new church plant in the other village , we had already people there worshipping the Lord."]}]}',
  ARRAY ['One whole year schedule and activities of Redeemer of Life. Pastor Banasing said, the reason why we are doing the whole year schedule and activities so that you can see you schedule every monthly. If ever you have new coming schedule. You know  what is your priority. I want to remind all pastors of Redeemer that the schedule that we are now doing is the first priority if you consider that you are under the Redeemer of Life ministry. Please see to it that all of you has the copy of our one whole year schedule of activities.', 'The new Redeemer pastors. Pastor Norman Gicaro, Benjie Bernasol, Ronel Tarino and Richard Mahinay. Your Monthly report will start on february for the month of January and some of you has lacking of  requirements such as Biography and family pictures please submit it as soon as possible because I need to submit it to NCC.', 'This coming Friday we will be having are survey for the new outreach combine of all redeemer pastors as our pilot program for the new church planting. The place was suggested by Pastor Mahinay in Victorias. ', 'This month we need to visit and reserve the venue for our Youth camp this coming 3rd weeks of April. Needs to suggest 2 to 3 venues and select the good one for us to reserve.  Incharge and action taken by: Pastor Nemuel and Pastor Leo De Pedro.', 'Right after our meeting we will proceed and visit pastor Saban  for prayers and moral support, since he just go home from hospital.'],
  '2018-02-12',
  'February 02, 2018',
  'Friday',
  '09:00 AM',
  'Redeemer of Life Church',
  'Pastor Florentino Alpas',
  'Pastor Noel Banasing'
);
