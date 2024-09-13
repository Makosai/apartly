# Instructions for using - UI Boilerplate

## Introduction

We have added some skeletons of general UI elements in this boilerplate so that the talents, while working on the project can focus on the functionalities more rather than the UI.

Being mentioned that, its not mandatory for the talents to use these elements in their project, in case, they would wish to create their own UI elements they are free to do so

## Structure

We are currently using vanilla HTML/CSS with [Material UI](https://www.muicss.com/docs/v1/css-js/boilerplate-html) CSS Framework, in order to avoid the usage the any package manager.

The structure is such that all the UI Skeleton elements are placed under `Pages/` directory, with individual sub-folder for each element.

Although, each element is an independent component, with its `.css` & `.html` files provided in the same sub-directory, however, for the ease of access, a navbar has been provided in all the screens, so that the user can access all the components, without the need for opening each element seperately
<br>
<br>

**P.S.: `index.html` can be used as the Entry Point to this project**

## Usage

As mentioned above, each of the element is added as a sub-folder inside `pages/` directory and each of them have their seperate `.css` and `.html` files.

Hence, they can be used in a similar way as per the requirement.

Please note, that in the boilerplates only HTML/CSS code is provided, as the intention is to prevent Talents to spend too much time on making the UI. The business logic, event handlers has to be handled by the talents themselves

**P.S.: Please make sure to import [Material UI](https://www.muicss.com/docs/v1/css-js/boilerplate-html) CSS Framework in your project to ensure the UI works as expected**
