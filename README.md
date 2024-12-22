# PomoBooster
#### Video Demo:  https://youtu.be/VSg-0aF-O3k
## Description
Welcome to my **CS50x Final project**!

This, the ***PomoBooster***, is a *Pomodoro timer* that help you to boost your efficiency by the *[Pomodoro method](https://en.wikipedia.org/wiki/Pomodoro_Technique)*. There is a timer that folow the Pomodoro time management method in which you focus on your work for 25 minutes (a.k.a pomodoro period) and then have a five-minute break. Every 4 cycles, you encounter a long break for 15 minutes. There is also a Todo list below the timer (log-in required) so that users can add their task and check their progress.

This web app was built using `HTML`, `CSS`, `Javascript`, `Python`, `Jinja` template, `Flask` and `Bootstrap` framework.

> You should run the source code on the CS50 codespace as the project use the CS50 library.


> This website was inspired by the [Pomofocus](pomofocus.io) website. The UI and some features may look quite identical but the code of the project was created by myself.

## Details

**HOMEPAGE**\
This is the most important page of the whole project!

Homepage during Pomodoro period:
![Image of homepage - logged in](/static/img/README_images/index_logged_in.png)

Homepage during Break period:
![Image of homepage - break time](/static/img/README_images/index_break.png)

**The pomodoro timer section:** The header of the section told you which period you are at (pomodoro, short break, long break). You can easily switch between them by clicking on the type of period you want. The body part display the time left in the period and the footer contains the start and skip buttons. When the timer on tick, the start button become the pause button. \
Another feature is that when it is pomodoro period, the theme color is red while in break period the theme color change to green.

**The tasks section:** To add a new task, you can simply type in the input box and click "add task" button and the new task will be added below. Since the task appear, there will also be a complete button and delete button, with tick and dust bin icon, respectively.\
The Homepage (`index.html`) does not rescrict access if the users not log in. However, the task section only appear for them to use once they had logged in.

**The navigation:** When you clicks on the profile picture or username displayed on the top right corner of the screen, a drop down box appears. The box contains profile, change avatar, change password, log out and delete account.

![Navigation dropdown box](/static/img/README_images/dropdown.png)

- `Profile`: *When you click on it, a box appear in the middle of the page displaying your username and email. Here, you can edit your information just by clicking on the edit button, change the information in the 2 boxes and click "save changes".*

- `Change avatar`: *To set your account, just click on this. When the Change Avatar box appear, browse an image file from your own computer and click "upload".*

- `Change password`: *This will direct you to the "/account" path. You will have to confirm your previous password and type in the new one.*

- `Log out`: *As its name, click it and you will be able to log out.*

- `Delete account`: *Once you click it, a box appear to confirm if you really want to delete the account and warn you that the action caanot be undone.*

<br>

**LOGIN, REGISTER, CHANGE PASSWORD PAGES**\
For these pages, I reused the code from Week 9 problem - finance - with a few changes to match the theme.

**RESPONSIVE**\
`CSS` and `Javascript` were used to ensure the website's responsiveness that its UI still looks good on different devices (PC, Tablet and phone sizes).

**BROWSER TAB**\
As users may use the *Pomodoro timer* to manage their time and work on the other tab of the browser that the same time. Therefore, the website was built with its title on tab represent the ongoing time, the same as the timer section.

**KEYBOARD INTERACTION**\
The user can use `Space` key to start or pause the pomodoro timer.\
To close the popup box, user can click `ESC` key.

## How to use
Clone this repository to your codespace and ensure that you can use CS50 library in your codespace. Go to the directory and run flask run.

## Credits
This is a one-person project.

## Reference
* CS50x. (n.d.). *CS50x learning materials*. Retrieved from https://cs50.harvard.edu/x/
* Flask. (n.d.). *Flask documentation*. Retrieved from https://flask.palletsprojects.com/en/latest/
* Jinja. (n.d.). *Jinja documentation*. Retrieved from https://jinja.palletsprojects.com/en/latest/
* GitHub. (n.d.). *Basic writing and formatting syntax*. Retrieved from https://docs.github.com/en/get-started/writing-on-github/basic-writing-and-formatting-syntax
* Visual Studio Code. (n.d.). *Markdown and Visual Studio Code*. Retrieved from https://code.visualstudio.com/docs/languages/markdown
* W3Schools. (n.d.). *W3Schools website*. Retrieved from https://www.w3schools.com/
* Pomofocus. (n.d.). *Pomofocus website*. Retrieved from https://pomofocus.io/

## AI in use
+ [*CS50 Duck Debugger*](https://cs50.ai/chat)
+ [*ChatGPT*](https://chatgpt.com/)

<hr>

**PS:** I took *CS50x* at the summer before I went to university. This is also the first online course I took about computer science. I intended to finish it in September but encountering a quite great change of my life by changing from studying at school to studying at university environment so I hardly have time for CS50. Therefore, the progress of the last few weeks were super slow. Anyway, I finished CS50x!
