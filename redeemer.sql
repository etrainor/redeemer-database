DROP TABLE IF EXISTS pastors, churches, meetings;

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

-- CREATE TABLE IF NOT EXISTS meetings (
--   id SERIAL PRIMARY KEY,
--   date TEXT,
--   start_time TIME,
--   end_time TIME,
--   venue VARCHAR(255),
--   meeting_host VARCHAR(255),
--   attendees TEXT[],
--   opening_prayer_by VARCHAR(255),
--   gods_message_by VARCHAR(255),
--   general_notes TEXT,
--   church_reports TEXT[],
--   other_matters TEXT[],
--   next_meeting DATE,
--   next_time TIME,
--   next_location VARCHAR(255),
--   closing_prayer_by VARCHAR(255)
-- );
CREATE TABLE IF NOT EXISTS meetings (
  id SERIAL PRIMARY KEY, 
  data JSON)
  ;

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

INSERT INTO meetings (data) VALUES ('{"date": "1923-10-26", "start_time": "08:00 AM", "end_time": "05:00 PM", "venue": "Disney Land", "meeting_host": "Mickey Mouse", "attendees": ["Mickey Mouse", "Minnie Mouse", "Donald Duck", "Daisy Duck", "Goofy", "Pluto"], "opening_prayer_by": "Mickey Mouse", "gods_message_by": "Goofy", "general_notes": "Be careful around children... they bite!", "church_reports": [{"church_id": "3", "report": "New park is opening next week", "prayerRequests": ["Safety of guests", "Rides are fun", "People to manage", "Financial Success"]}], "other_matters": ["Cinderella needs a Castle", "Tell Snow White not to eat the apple", "Someone needs to wake up Sleeping Beauty"], "next_meeting": "1924-10-26", "next_time": "08:00 AM", "next_location": "Walt Disney Headquarters", "closing_prayer_by": "Donald Duck"}'
);

-- {
--   "date":"2019-09-12",
--   "start_time":"12:00 AM",
--   "end_time":"12:00 AM",
--   "venue":"hgfd",
--   "meeting_host":"fgh",
--   "attendees":["fg","fgh","dfgh","fg","fgh","dfgh"],
--   "opening_prayer_by":"fgh",
--   "gods_message_by":"fdgh",
--   "general_notes":"fdgh",
--   "church_reports":[
--     {
--       "church_id":"3",
--       "report":"fdghdfdg",
--       "prayerRequests":["fdg","dfg","dfg","fdg","fdg","dfg","fdgf","sdfg","fdg"]
--     },
--     {
--       "church_id":"2",
--       "report":"fdg",
--       "prayerRequests":["dfg","dfg","dsfg"]
--     },
--   ],
--   "other_matters":["fgh","dfg","dfgbv"],
--   "next_meeting":"2019-09-14",
--   "next_time":"4:00 PM",
--   "next_location":"fdghn",
--   "closing_prayer_by":"fdghnb"
--   }