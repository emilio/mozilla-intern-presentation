const bz = require('bz').createClient({
  url: 'https://bugzilla.mozilla.org/bzapi'
});

const github = new (require('github'))({
    // debug: true,
    protocol: "https",
    host: "api.github.com",
    timeout: 20000
});

const GH_TOKEN = require('./gh-token').token;

const INTERNSHIP_STARTED = Date.parse("2016-06-16");

github.authenticate({
  type: 'oauth',
  token: GH_TOKEN,
})

const processResult = function(_wat, results) {
  results = results.filter(r => Date.parse(r.last_change_time) > INTERNSHIP_STARTED)
                   .map(r => r.id);
  console.log("Worked on a total of " + results.length + " bugs");
  console.log(results);
}

bz.searchBugs({
  email1: "ecoal95@gmail.com",
  email1_assigned_to: "1",
  bug_status: ["NEW","ASSIGNED","REOPENED", "UNCONFIRMED", "RESOLVED"],
  include_fields: [
    "id",
    "assigned_to",
    "summary",
    "last_change_time",
    "component",
    "whiteboard"
  ],
}, processResult);

github.issues.getForRepo({
  user: "servo",
  repo: "servo",
  assignee: "emilio",
  state: "all",
  since: INTERNSHIP_STARTED,
  per_page: 100,
}).then(issues => {
  issues = issues.filter(issue => !!issue.pull_request);
  console.log("Reviewed ", issues.length);
  issues.forEach(issue => {
    console.log("Reviewed: ", issue.id, issue.title);
  })
})

github.issues.getForRepo({
  user: "servo",
  repo: "servo",
  state: "all",
  creator: "emilio",
  since: INTERNSHIP_STARTED,
  per_page: 100,
}).then(issues => {
  issues = issues.filter(issue => !!issue.pull_request);
  console.log("Created ", issues.length);
  issues.forEach(issue => {
    console.log("Created: ", issue.id, issue.title);
  })
})
