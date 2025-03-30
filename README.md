# Canvas Landing Page Server

A simple Express backend server for the Canvas AEM Landing Page that collects and stores user form data in MongoDB.

## Setup

1. Install dependencies
```
npm install
```

2. Create a .env file with the following variables:
```
PORT=6000
MONGODB_URI=mongodb://localhost:27017/canvas-landing-page
```

3. Make sure MongoDB is running on your system

## Running the server

Start the server in development mode:
```
npm run dev
```

Start the server in production mode:
```
npm start
```

## API Endpoints

- `POST /api/users` - Submit form data (name, email, company)
- `GET /api/users` - Get all users (for testing purposes)

## Frontend Integration

To connect the frontend to this server, update your form submission in the React component to send data to this API endpoint:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setUnlocking(true);
  
  try {
    const response = await fetch('http://localhost:6000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    console.log('Success:', data);
    
    setFormSubmitted(true);
    setShowForm(false);
    setUnlocking(false);
    if (wasFullScreen && videoRef.current) enterFullscreen(videoRef.current);
    if (videoRef.current) videoRef.current.play();
  } catch (error) {
    console.error('Error:', error);
    setUnlocking(false);
  }
}; 