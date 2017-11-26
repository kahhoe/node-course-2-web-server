const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');

app.use(express.static(__dirname + '/public'));

app.use((req,res,next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`
  console.log(log);
  fs.appendFile('server.log',log + '\n', (err) =>
  {
      if (err)
      {
        console.log("Unable to append to server.log");
      }
  });

  next();
});

var isMaintenance = false;

app.use((req,res,next) => {
    if (isMaintenance)
    {
      res.render('maintenance.hbs',{
      });
    } else {
      next();
    }
});

hbs.registerHelper('getCurrentYear', () =>
  {
      return new Date().getFullYear();
  }
);

hbs.registerHelper('screamIt', (text) =>
  {
      return text.toUpperCase();
  }
);

app.get('/', (req,res) =>
  {
    res.render('home.hbs',{
      pageTitle: "Home Page from Parameters",
      currentYear: new Date().getFullYear(),
      pageMessage: "Welcome to home page of express!"
    });
  }
);

app.get('/about', (req,res) =>
  {
    res.render('about.hbs',{
      pageTitle: "About Page from Parameters",
      currentYear: new Date().getFullYear()
    });
  }
);
app.get('/project', (req,res) =>
  {
    res.render('project.hbs',{
      pageTitle: "Project Page from Parameters",
      currentYear: new Date().getFullYear()
    });
  }
);

app.get('/bad', (req,res) =>
  {
    var message = {
      message: 'bad access',
      code: 2017
    };
    res.send(message);
  }
);

app.listen(port, () =>
  {
      console.log(`Server is now running at port ${port}`);
  }
);
