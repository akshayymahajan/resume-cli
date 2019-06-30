const inquirer = require("inquirer");
const utils = require("./utils");
const resume = require("./resume");
inquirer.registerPrompt("autosubmit", require("inquirer-autosubmit-prompt"));

let choices = [...resume.menu];
if (resume.sections.contact) {
  choices.push("Contact Me");
}
const menu = [
  {
    type: "list",
    name: "section",
    message: "Select an option to know more about me:",
    choices: [...choices, "Exit"],
    filter: function(val) {
      return val.toLowerCase().replace(/\s+/g, "_");
    }
  }
];

const sections = resume.sections;

function showContactForm() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Your Name:",
      validate: function(value) {
        return value.trim().length > 0 ? true : "Please enter your name";
      }
    },
    {
      type: "input",
      name: "email",
      message: "Your Email:",
      validate: function(value) {
        return value.trim().length > 0 ? true : "Please enter your email";
      }
    },
    {
      type: "input",
      name: "message",
      message: "Message:",
      validate: function(value) {
        return value.trim().length > 0 ? true : "Please enter your message";
      }
    }
  ]);
}

function pressAnyKeyToReturn() {
  inquirer
    .prompt([
      {
        type: "autosubmit",
        name: "back",
        message: "Press any key to return to the main menu...",
        transformer: () => "",
        autoSubmit: input => input.length > 0
      }
    ])
    .then(() => {
      showMenu();
    });
}

function showMenu() {
  utils.clearTerminal();

  console.log(sections.intro);

  inquirer.prompt(menu).then(answers => {
    if (answers.section === "exit") {
      return;
    } else if (answers.section === "contact_me") {
      showContactForm().then(answers => {
        console.log("Sending your message...");
        utils
          .submitResponse(
            sections.contact.url,
            {
              ...sections.contact.data,
              ...answers
            },
            sections.contact.config
          )
          .then(() => {
            console.log("✅ Message Sent Successfully!");
            pressAnyKeyToReturn();
          })
          .catch(() => {
            console.log("❌ There was an error sending the message!");
            pressAnyKeyToReturn();
          });
      });
    } else {
      console.log(sections[answers.section]);
      pressAnyKeyToReturn();
    }
  });
}

showMenu();
