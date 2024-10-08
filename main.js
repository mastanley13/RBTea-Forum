// public/main.js

// Initialize socket.io
const socket = io();

// Listen for new comments
socket.on('newComment', (comment) => {
  addCommentToSection(comment);
});

// Function to add a comment to the DOM
function addCommentToSection(comment) {
  const commentSection = document.getElementById('commentSection');
  const commentElement = document.createElement('div');
  commentElement.className = 'comment';
  commentElement.innerHTML = `<strong>${comment.name}:</strong> ${comment.comment}`;
  commentSection.insertBefore(commentElement, commentSection.firstChild);

  // Adjust iframe height
  resizeIframe();
}

document.getElementById('commentForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.querySelector('input[name="name"]').value;
  const comment = document.querySelector('textarea[name="comment"]').value;

  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      comment
    })
  });

  if (response.ok) {
    alert('Comment added!');
    document.getElementById('commentForm').reset();
  } else {
    const data = await response.json();
    alert(data.error || 'Error adding comment.');
  }
});

// Update loadComments to use addCommentToSection
async function loadComments() {
  const response = await fetch('/api/comments');
  const comments = await response.json();

  const commentSection = document.getElementById('commentSection');
  commentSection.innerHTML = '';

  comments.forEach((comment) => {
    addCommentToSection(comment);
  });
}

document.addEventListener('DOMContentLoaded', loadComments);

// Function to adjust iframe height
function resizeIframe() {
  const height = document.body.scrollHeight;
  window.parent.postMessage({ frameHeight: height }, '*');
}

window.addEventListener('load', resizeIframe);
window.addEventListener('resize', resizeIframe);

document.addEventListener('DOMContentLoaded', () => {
  const commentForm = document.getElementById('comment-form');
  const commentList = document.getElementById('comment-list');

  // Function to fetch and display comments
  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const comments = await response.json();
      commentList.innerHTML = comments.map(comment => `
        <li>${comment.text} - ${comment.author}</li>
      `).join('');
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Fetch comments on page load
  fetchComments();

  // Handle form submission
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('comment-text').value;
    const author = document.getElementById('comment-author').value;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, author }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clear form fields
      document.getElementById('comment-text').value = '';
      document.getElementById('comment-author').value = '';

      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  });
});
