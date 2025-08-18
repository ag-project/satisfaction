function hideElements() {
    document.getElementById('overlay').classList.add('closed');
    document.getElementById('popup').classList.add('closed');
    document.body.style.overflow = 'auto';
}

document.getElementById('close-btn').addEventListener('click', function() {
    hideElements();
});

// 	document.getElementById('overlay').addEventListener('click', function() {
//	   hideElements();
//	});