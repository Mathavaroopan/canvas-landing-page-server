// This is how you would update the handleSubmit function in your React component
// to point to the Netlify deployed function

const handleSubmit = async (e) => {
  e.preventDefault();
  setUnlocking(true);
  setSubmitError(null);
  
  try {
    // Replace YOUR_NETLIFY_URL with your actual Netlify URL after deployment
    // For example: https://canvas-landing-page.netlify.app/api/users
    const response = await fetch('https://YOUR_NETLIFY_URL/api/users', {
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