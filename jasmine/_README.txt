This directory contains a maven project example for JavaScript unit testing using Jasmine.

There are two ways to run unit tests:
1- mvn jasmine:bdd
     This starts a Jasmine server whose test results can be viewed on a web browser using
     a URL specified on the console output, for example:

       http://localhost:8234

     Refreshing the browser screen re-runs the tests.

2- mvn test
     This runs the tests and displays the results on the console.
     It also writes its results to target/jasmine/TEST-jasmine.xml.