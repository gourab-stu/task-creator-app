const validate = (event, name="title") => {
    let title = document.getElementsByName(name)[0];
    if (/^[A-Za-z ]+$/.test(title.value)) return true;
    else {
        alert("Enter only letters in title");
        return false;
    }
}

const editValidate = (event) => {
    validate(event, "newTitle");
}

const view = (event) => {
    window.location.href = event.target.baseURI + event.target.attributes.href.nodeValue;
}