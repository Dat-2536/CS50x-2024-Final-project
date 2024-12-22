import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, url_for, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

# Configure file upload
UPLOAD_FOLDER = 'static/profile_pictures'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Configure application
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB limit

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///pomodoro.db")

# Check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():
    """Render the main page (index.html) with the user's profile picture"""

    username = None
    email = None
    profile_picture_url = None
    tasks = None
    if "user_id" in session:
        user_id = session["user_id"]

        # Fetch user data from the database (username and profile_picture)
        user = db.execute("SELECT username, profile_picture FROM users WHERE id = ?", user_id)[0]
        email = db.execute("SELECT email FROM users WHERE id = ?", user_id)[0]["email"]
        username = user["username"]
        profile_picture = user["profile_picture"]
        tasks = db.execute("SELECT id, task, status FROM tasks WHERE user_id = ? ORDER BY status DESC", user_id)

        # Set the URL to the profile picture (if exists)
        profile_picture_url = url_for('static', filename=f'profile_pictures/{profile_picture}' if profile_picture else 'default.png')

    return render_template("index.html", username=username, email=email, profile_picture_url=profile_picture_url, tasks=tasks)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username-email"):
            flash("must provide username or email")
            return render_template("login.html"), 403

        # Ensure password was submitted
        elif not request.form.get("password"):
            flash("must provide password")
            return render_template("login.html"), 403

        # Retrieve the user_id of the newly inserted user
        user_id = db.execute("SELECT id FROM users WHERE username = ? OR email = ?", request.form.get("username-email"), request.form.get("username-email"))

        # Ensure username exists
        if len(user_id) == 0:
            flash("Username not exist!")
            return render_template("login.html"), 403
        elif len(user_id) != 1:
            flash("Invalid username!")
            return render_template("login.html"), 403

        # Select hashed password
        hash = db.execute("SELECT hash FROM hashes WHERE user_id = ?;", user_id[0]["id"])[0]["hash"]

        # Ensure password is coorect
        if not check_password_hash(hash, request.form.get("password")):
            flash("Invalid password!")
            return render_template("login.html"), 403


        # Remember which user has logged in
        session["user_id"] = user_id[0]["id"]

        # Redirect user to home page
        flash("Welcome to PomoTimer!")
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")

@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            flash("Must provide username!")
            return render_template("register.html"), 403

        # Ensure password was submitted
        if not request.form.get("password"):
            flash("Must provide password!")
            return render_template("register.html"), 403

        # Ensure password was confirmed
        if not request.form.get("confirmation"):
            flash("Must confirm password!")
            return render_template("register.html"), 403

        # Ensure confirmation was correct
        if not (request.form.get("password") == request.form.get("confirmation")):
            flash("Password do not match!")
            return render_template("register.html"), 403

        # Generate hash for password
        hashed_password = generate_password_hash(request.form.get("password"))

        # Insert the new user into the users table
        db.execute(
            "INSERT INTO users (username, email, profile_picture) VALUES (?, ?, 'default.png');",
            request.form.get("username"),
            request.form.get("email")
        )

        # Retrieve the user_id of the newly inserted user
        user_id = db.execute("SELECT id FROM users WHERE username = ?;", request.form.get("username"))[0]["id"]

        # Insert new user to database
        try:
            db.execute(
                "INSERT INTO hashes (user_id, hash) VALUES (?, ?);",
                user_id,
                hashed_password,
            )
        except ValueError:
            flash("User already exist!")
            return render_template("register.html"), 403

        # Redirect user to home page
        flash("Registered!")
        return redirect("/login")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("register.html")


@app.route("/account", methods=["GET", "POST"])
def change_password():
    "Change user's password"

    username = None
    profile_picture_url = None
    if "user_id" in session:
        user_id = session["user_id"]

        # Fetch user data from the database (username and profile_picture)
        user = db.execute("SELECT username, profile_picture FROM users WHERE id = ?", user_id)[0]
        username = user["username"]
        profile_picture = user["profile_picture"]
        email = db.execute("SELECT email FROM users WHERE id = ?", user_id)[0]

        # Set the URL to the profile picture (if exists)
        profile_picture_url = url_for('static', filename=f'profile_pictures/{profile_picture}' if profile_picture else 'default.png')

    # User reached route via POST
    if request.method == "POST":
        # Ensure old password was submitted
        if not request.form.get("old-password"):
            flash("Must provide old password!")
            return render_template("account.html", username=username, profile_picture_url=profile_picture_url, email=email), 403

        # Ensure new password was submitted
        elif not request.form.get("new-password"):
            flash("Must provide new password!")
            return render_template("account.html", username=username, profile_picture_url=profile_picture_url, email=email), 403

        # Ensure new password was confirmed
        if not request.form.get("confirmation"):
            flash("Must confirm new password!")
            return render_template("account.html", username=username, profile_picture_url=profile_picture_url, email=email), 403

        # Ensure confirmation was correct
        if not (request.form.get("new-password") == request.form.get("confirmation")):
            flash("New password do not match!")
            return render_template("account.html", username=username, profile_picture_url=profile_picture_url, email=email), 403

        # Query database for username
        user_id = db.execute("SELECT id FROM users WHERE id = ?", session["user_id"])

        # Ensure username exists and password is correct
        if len(user_id) != 1:
            flash("Invalid username!")
            return render_template("account.html", username=username, profile_picture_url=profile_picture_url, email=email), 403

        user_id = user_id[0]["id"]

        # Query the hashes table for the user's current password hash
        hash_rows = db.execute("SELECT hash FROM hashes WHERE user_id = ?;", user_id)


        if len(hash_rows) != 1 or not check_password_hash(
            hash_rows[0]["hash"], request.form.get("old-password")
        ):
            flash("Invalid password!")
            return render_template("account.html", username=username, profile_picture_url=profile_picture_url, email=email), 403

        # Generate hash for new password
        hashed_password = generate_password_hash(request.form.get("new-password"))

        # Replace old password with new password in the hashes table
        db.execute("UPDATE hashes SET hash = ? WHERE user_id = ?",
                hashed_password, user_id)

        return redirect("/")

    # User reached route via GET
    else:
        return render_template("account.html", username=username, profile_picture_url=profile_picture_url, email=email) 


@app.route("/delete_account", methods=["POST"])
def delete_account():
    """Delete user account after confirmation"""

    # Ensure user is logged in
    if not session["user_id"]:
        flash("Unauthorized!")
        return render_template("index.html"), 401

    try:
        # Get user ID
        user_id = session["user_id"]

        # Fetch user details (username)
        user = db.execute("SELECT username FROM users WHERE id = ?", user_id)
        if not user:
            flash("User not found!")
            return render_template("index.html"), 401

        username = user[0]["username"]

        # Delete related data from other tables
        db.execute("DELETE FROM hashes WHERE user_id = ?", user_id)  # Delete password hash
        db.execute("DELETE FROM tasks WHERE user_id = ?", user_id)   # Delete tasks

        # Delete the user from the users table
        db.execute("DELETE FROM users WHERE id = ?", user_id)

        # Clear session
        session.clear()

        # Return success response
        flash(f"Account for {username} has been deleted.", "success")
        return redirect("/")

    except Exception as e:
        flash(f"Error deleting account: {e}")
        return render_template("index.html"), 500


@app.route("/upload_profile_picture", methods=["POST"])
def upload_profile_picture():
    if "user_id" not in session:
        flash("Unauthorized!")
        return render_template("index.html"), 401

    if "profile_picture" not in request.files:
        flash("No file part!")
        return render_template("index.html"), 400

    file = request.files["profile_picture"]

    if file.filename == "":
        flash("No selected file!")
        return render_template("index.html"), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        user_id = session["user_id"]
        db.execute("UPDATE users SET profile_picture = ? WHERE id = ?", filename, user_id)

        return jsonify({"success": True})

    flash("Invalid file type!")
    return render_template("index.html"), 400


@app.route("/update_profile", methods=["POST"])
def update_profile():
    """Update user profile after editing"""

    if "user_id" not in session:
        flash("Unauthorized!")
        return jsonify({"success": False}), 401

    # Get the new data from the request (JSON payload)
    data = request.get_json()
    new_username = data.get("username")
    new_email = data.get("email")

    if not new_username or not new_email:
        flash("Invalid input data!")
        return jsonify({"success": False}), 400

    try:
        # Update the user's information in the database
        user_id = session["user_id"]
        db.execute("UPDATE users SET username = ?, email = ? WHERE id = ?",
                   new_username, new_email, user_id)

        # Return a success response
        return jsonify({"success": True})

    except Exception as e:
        flash(f"Error updating profile: {e}")
        return jsonify({"success": False}), 500


@app.route("/add_task", methods=["POST"])
def add_task():
    user_id = None
    user_id = session["user_id"]
    task = request.json.get("task")

    if not user_id:
        return jsonify({"success": False, "error": "Log in to use this feature"}), 400

    if not task:
        return jsonify({"success": False, "error": "Task cannot be empty"}), 400

    # Insert task into the database
    new_task_id = db.execute("INSERT INTO tasks (user_id, task, status) VALUES (?, ?, 'pending')", user_id, task)
    return jsonify({"success": True, "task_id": new_task_id})


@app.route("/delete_task", methods=["POST"])
def delete_task():
    task_id = request.json.get("task_id")
    user_id = session["user_id"]

    db.execute("DELETE FROM tasks WHERE id = ? AND user_id = ?", task_id, user_id)
    return jsonify({"success": True})


@app.route("/complete_task", methods=["POST"])
def complete_task():
    task_id = request.json.get("task_id")
    user_id = session["user_id"]

    db.execute("UPDATE tasks SET status = 'completed' WHERE id = ? AND user_id = ?", task_id, user_id)
    return jsonify({"success": True})
