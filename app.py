from flask import Flask, request, render_template, redirect, url_for
import pandas as pd
import os

app = Flask(__name__)

# File path for storing student data
FILE_PATH = "students.xlsx"

# Check if the file exists; if not, create it
if not os.path.exists(FILE_PATH):
    df = pd.DataFrame(columns=["USN", "Name", "SGPA"])
    df.to_excel(FILE_PATH, index=False)

def read_excel():
    """Read student data from the Excel file."""
    return pd.read_excel(FILE_PATH)

def write_excel(df):
    """Write student data back to the Excel file."""
    df.to_excel(FILE_PATH, index=False)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        usn = request.form['usn'].strip().upper()
        df = read_excel()
        
        if usn in df["USN"].values:
            student = df[df["USN"] == usn].iloc[0]
            return render_template('student.html', usn=usn, name=student["Name"], sgpa=student["SGPA"])
        else:
            return render_template('new_student.html', usn=usn)
    return render_template('index.html')

@app.route('/add_student', methods=['POST'])
def add_student():
    usn = request.form['usn'].strip().upper()
    name = request.form['name'].strip()
    sgpa = request.form['sgpa'].strip()
    df = read_excel()
    
    new_entry = pd.DataFrame([[usn, name, sgpa]], columns=["USN", "Name", "SGPA"])
    df = pd.concat([df, new_entry], ignore_index=True)
    write_excel(df)
    
    return render_template('student.html', usn=usn, name=name, sgpa=sgpa)

if __name__ == '__main__':
    app.run(debug=True)
    