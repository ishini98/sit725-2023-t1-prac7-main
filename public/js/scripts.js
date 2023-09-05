let socket = io();
//emit an event
socket.emit('chat message','Hello User');
socket.on('number', (msg) => {
    console.log('Random number: ' + msg);
    $('#socketout').html(msg);
});
//Recive an event
socket.on('chat message',(message)=>{
    console.log('Recevied message',message);
});

const addCards = (items) => {
    console.log(items);
    items.forEach(item => {
        let itemToAppend = `<div class="col s4 center-align">
            <div class="card medium">
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" src="${item.image}" alt="${item.title}">
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${item.title}<i class="material-icons right">more_vert</i></span>
                    <p><a href="#">About this kitten</a></p>
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">${item.title}<i class="material-icons right">close</i></span>
                    <p class="card-text">${item.description}</p>
                </div>
            </div>
        </div>`;
        $('#card-section').append(itemToAppend);
    });
}


const submitForm = () => {
    let formData = new FormData();
    formData.append('title', $('#title').val());
    formData.append('link', $('#link').val());
    formData.append('description', $('#description').val());

    // Get the selected file from the input field
    let imageInput = $('#image')[0];
    formData.append('image', imageInput.files[0]);

    console.log('form data: ', formData);
    addCat(formData);
}


const getCats = () => {
    $.get('/api/cats', (res) => {
        if (res.statusCode === 200) {
            addCards(res.data);
        }
    });
}

const addCat = (cat) => {
    $.ajax({
        url: 'api/cats',
        data: cat,
        type: 'POST',
        processData: false, // Don't process the data
        contentType: false, // Don't set content type
        success: (result) => {
            alert(result.message);
            location.reload();
        }
    });
}

$(document).ready(function(){
    $('.materialboxed').materialbox();
    $('.modal').modal();

    getCats();

    $('#formSubmit').click(()=>{
        submitForm();
    })
});