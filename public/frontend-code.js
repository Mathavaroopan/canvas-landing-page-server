// This is how you would update the handleSubmit function in your React component
// to point to the Netlify function

const handleSubmit = async (e) => {
  e.preventDefault();
  setUnlocking(true);
  setSubmitError(null);
  
  try {
    // Use the direct function URL for better reliability
    const response = await fetch('https://resplendent-strudel-d7b326.netlify.app/.netlify/functions/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    console.log('Form submission successful:', data);
    
    setFormSubmitted(true);
    setShowForm(false);
    setUnlocking(false);
    if (wasFullScreen && videoRef.current) enterFullscreen(videoRef.current);
    if (videoRef.current) videoRef.current.play();
  } catch (error) {
    console.error('Form submission error:', error);
    setSubmitError('Failed to submit form. Please try again.');
    setUnlocking(false);
  }
}; 