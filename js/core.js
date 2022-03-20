//***********************
// Load Templates
//***********************
$('navbar').load('/templates/navbar.html');

var i = document.createElement('img');
i.src = Config.banner_img;
$('banner').append(i);

$('footer').load('/templates/footer.html');
