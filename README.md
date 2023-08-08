# UI Boilerplate

## Introduction

We want to prepare UI starting code for our talents. Over the last 12 months we are trying to reduce the workload of T2 tasks in terms having talents providing smart code than giving them a workload. The idea would be let us provide them with basic layout built on well known HTML/CSS framework ([Material UI](https://www.muicss.com/docs/v1/css-js/boilerplate-html)) so they can focus on writing seasoned FE / BE code. The fact is, while evaluating core dev screening, we are less focused on UI code. We are careful about the UX, but again, UX is usually a final drop if the project is poorly constructed.

For far many times, we have heard talents saying they spent too much time working on UI element of our projects and for sure, this can be less motivating to deliver our T2.

### The goal is:

- create a boilerplate for future tasks so we can use it to build the starting HTML code for our full-stack tasks

- ensure we can reduce the workload in terms of less-valuable work, while focusing on talents work on something that shows their skills and seasonality

- ensure we can maintain this easily

Please note, that in the boilerplates only HTML/CSS code is provided, as the intention is to prevent Talents to spend too much time on making the UI. The business logic, event handlers should be handled by the talent themselves.

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

Please note, that in the boilerplates only HTML/CSS code is provided, as the intention is to prevent Talents to spend too much time on making the UI. The business logic, event handlers has to be handled by the talents only

**P.S.: Please make sure to import [Material UI](https://www.muicss.com/docs/v1/css-js/boilerplate-html) CSS Framework in your project to ensure the UI works as expected**

### <ins>Using this boilerplate for Talent's repo</ins>

- Please make sure to copy all the files EXCEPT Readme.md
- The instructions for talents to use this boilerplate is provided in `Instructions.md` file, please make sure to copy that file as well to talent's repo while cloning/copying the boilerplate
