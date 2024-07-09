import sys
import logging
import pymysql
import json
import os
from datetime import datetime

# rds settings
user_name = os.environ['USER_NAME']
password = os.environ['PASSWORD']
rds_proxy_host = os.environ['RDS_PROXY_HOST']
db_name = os.environ['DB_NAME']

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# create the database connection outside of the handler to allow connections to be
# re-used by subsequent function invocations.
try:
    conn = pymysql.connect(host=rds_proxy_host, user=user_name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit(1)

logger.info("SUCCESS: Connection to RDS for MySQL instance succeeded")

# Define the paths for adding a user and retrieving all users
user_path = '/user'
users_path = '/users'
status_path = '/status'
notes_path = '/notes'

def lambda_handler(event, context):
    """
    This function handles adding a user and retrieving all users from the UserTable.
    """
    
    http_method = event.get('httpMethod')
    path = event.get('path')
    
    # Check if it's a POST request to add a user
    if http_method == 'POST' and path == user_path:
        payload = json.loads(event['body'])
        return add_user(payload)
        
    # Check if new user email is available
    elif http_method == 'GET' and path == user_path:
        return check_status()
    
  
    # Check if it's a GET request to retrieve a specific user by email and password
    elif http_method == 'GET' and path == users_path:
       
        query_params = event.get('queryStringParameters', {})
        
        if query_params is None:
            # If no query parameters are provided, return an error response
            return build_response(400, "Missing query parameters")
       
        userEmail = query_params.get('userEmail', '')
        userPassword = query_params.get('userPassword', '')
        
        # Check if both email and password are provided
        if not userEmail or not userPassword:
            return build_response(400, "Email and password are required")
        
        return get_user_by_email_and_password(userEmail, userPassword)
    
    
    elif http_method == 'POST' and path == notes_path:
        payload = json.loads(event['body'])
        return add_note(payload)
        
    # Handle notes endpoint
    elif http_method == 'GET' and path == notes_path:
        
            query_params = event.get('queryStringParameters', {})
            userId_str = query_params.get('userId', '')
            userId = int(userId_str) if userId_str.isdigit() else None
            logger.info(f"User ID===: {userId}")
            
            if userId is None:  # Check if userId is missing or empty
                return build_response(400, "User ID is required")
            return get_notes_by_user_id(userId)
    elif http_method == 'POST':
            payload = json.loads(event['body'])
            return add_note(payload)
    
    elif http_method == 'DELETE' and path == notes_path:
        payload = json.loads(event['body'])
        return delete_note(payload)
        
    # Handle OPTIONS request for CORS preflight
    elif http_method == 'OPTIONS':
        return build_response(200, {})  # Respond with empty body for OPTIONS requests
    
    # Return 404 Not Found for other paths or methods
    else:
        return {
            'statusCode': 404,
            'body': "Not Found"
        }

    """
    ========= Functions ======================================
    """     
        
def add_user(payload):
    """
    Add a user to the UserTable.
    """
    userEmail = payload['userEmail']
    if check_duplicate_email(userEmail):
        return build_response(400, "Email already exists")
        
    with conn.cursor() as cur:
        sql = "INSERT INTO Users (userEmail, userName, userPassword) VALUES (%s, %s, %s)"
        cur.execute(sql, (payload['userEmail'], payload['userName'], payload['userPassword']))
        conn.commit()
        
        return build_response(200, "User added successfully")


def check_status():
    """
    Retrieve all users from the UserTable.
    """
    with conn.cursor() as cur:
        sql = "SELECT * FROM Users"
        cur.execute(sql)
        result = cur.fetchall()
        return build_response(200, result)
    return {
            'statusCode': 404,
            'body': "Not !!!!!"
    }
    
        
def build_response(status_code, body):
    """
    Build HTTP response with CORS headers.
    """
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps(body,default=datetime_to_string)
    }
    
def get_user_by_email_and_password(userEmail, userPassword):
    """
    Retrieve a specific user from the UserTable by email and password.
    """
    with conn.cursor() as cur:
        sql = "SELECT * FROM Users WHERE userEmail = %s AND userPassword = %s"
        cur.execute(sql, (userEmail, userPassword))
        user = cur.fetchone()
        if user:
            return build_response(200, user)
        else:
            return build_response(404, "User not found")
            
            
def check_duplicate_email(userEmail):
    """
    Check if the provided email already exists in the database.
    """
    with conn.cursor() as cur:
        sql = "SELECT COUNT(*) FROM Users WHERE userEmail = %s"
        cur.execute(sql, (userEmail,))
        result = cur.fetchone()
        # If result is not None and count is greater than 0, email exists
        return result is not None and result[0] > 0


def add_note(payload):
    #     """
    #     Add a note to the Notes table.
    #     """
    userId = payload['userId']
    book = payload['book']
    chapter = payload['chapter']
    startVerse = payload['startVerse']
    endVerse = payload['endVerse']
    noteContent = payload['noteContent']
    createdAt = payload['createdAt']  
    
    logger.info(f"Received payload: userId={userId}, book={book}, chapter={chapter}, startVerse={startVerse}, endVerse={endVerse}, noteContent={noteContent}, createdAt={createdAt}")
    
    try:
        with conn.cursor() as cur:
            sql = "INSERT INTO Notes (userId, book, chapter, startVerse, endVerse, noteContent, createdAt) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            cur.execute(sql, (userId, book, chapter, startVerse, endVerse, noteContent, createdAt))
            conn.commit()
        return build_response(200, "Note added successfully")
        
    except pymysql.MySQLError as e:
        logger.error("ERROR: Could not add note.")
        logger.error(e)
        return build_response(500, "Internal Server Error")

def get_notes_by_user_id(userId):
    """
    Retrieve notes for a specific user from the Notes table by user ID.
    """
    with conn.cursor() as cur:
        sql = "SELECT * FROM Notes WHERE userId = %s"
        cur.execute(sql, (userId,))
        notes = cur.fetchall()
        return build_response(200, notes)

def delete_note(payload):
    """
    Delete a note from the Notes table by note ID and user ID.
    """
    noteId = payload['noteId']
    userId = payload['userId']
    logger.info(f"Received delete request: noteId={noteId}, userId={userId}")
    try:
        with conn.cursor() as cur:
            sql = "DELETE FROM Notes WHERE noteId = %s AND userId = %s"
            cur.execute(sql, (noteId, userId))
            conn.commit()
        return build_response(200, "Note deleted successfully")
        
    except pymysql.MySQLError as e:
        logger.error("ERROR: Could not delete note.")
        logger.error(e)
        return build_response(500, "Internal Server Error")


def datetime_to_string(obj):
    if isinstance(obj, datetime):
        return obj.strftime('%Y-%m-%d %H:%M:%S')
    raise TypeError(f'Object of type {obj.__class__.__name__} is not JSON serializable')
