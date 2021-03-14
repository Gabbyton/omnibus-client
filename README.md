# CWRU Omnibus

Angular web application for tracking shuttles for Case Western Reserve University 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.7.

## Development setup

To keep API keys secret during development, we've decided to replace the index file with a duplicate one with the key during every build. To be able to use this app in development, copy the `index.html` file and paste it as `index-dev.html` in the same `src` folder.

**NOTE:** this project is *obviously* not set up for production yet. We will update the configuration for a production scenario in the future.

After this step, you can proceed with the instructions in section below:

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
