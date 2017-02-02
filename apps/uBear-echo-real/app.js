"use strict";



// Depedencies: get them through npm install (name)
const alexa = require("alexa-app");
const request = require("request");
// Allow this module to be reloaded automatically when code is changed
module.change_code = 1;

// Define an alexa-app
const app = new alexa.app("uBear");


// Called when user says "open uBear"
app.launch(function(req, res) {
	res.say("Hello. This is OO Bear. I can hail an ambulance if you're a bear in need.");
	res.shouldEndSession(false, "Are you sure you want to leave?");
});

// "ask bluebird for the last tweet from william t d r"
app.intent("GetHelp", {
		"slots": {"Location": "LITERAL"},
		"utterances": [
     "im hurt",
     "help me",
     "it hurts",
     "im in pain",
     "im bleeding",
     "im experiencing trouble",
     "im not doing so good",
     "ive fallen and i cant get up",
     "im hurt and im at the {location variable|Location}",
     "im not doing so good at the {location variable|Location}",
     "im experiencing trouble at the {location variable|Location}",
     "im bleeding im at the {location variable|Location}",
     "im in pain im at the {location variable|Location}",
     "it hurts im at the {location variable|Location}",
     "help me im at the {location variable|Location}"
		]
	}, (req, res) => {
      let intent = req.data.request.intent;

      if(intent.slots.Location.value){
        request('http://tdr.moe:9200/go/' + intent.slots.Location.value, function (error, response, data) {
          try {
            data = JSON.parse(data);

            if(data.success) {
              console.log(1);
              res.say("The ambulance is on its way.").send();
            } else {
              console.log(2);
              res.say(data.reason).send();
            }
          } catch(e) {
            console.log(data);
            console.log(e.stack);
          }
        });
      } else {
        res.say("I'm happy to help. Where are you?").send();
      }

      	return false;
		}
);


// Last-resort error method (unknown intent, etc)
app.post = function(request, response, type, exception) {
	if(exception) {
    response.say("Sorry, there was a problem connecting you to your ambulance.").send();

    console.log(exception);
  }

  return false;
};

module.exports = app;
