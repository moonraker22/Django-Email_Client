document.addEventListener('DOMContentLoaded', function() {

    // By default, load the inbox
    load_mailbox('inbox');


    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);


    // Send the email
    document.querySelector('#submit-send').addEventListener('click', function(event) {

        // Prevent form submission
        event.preventDefault();

        // Send the email
        send_email();
    });




});


function compose_email(email) {

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#read-view').style.display = 'none';
    document.querySelector('#sent-view').style.display = 'none';
    document.querySelector('#archived-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields or populate with reply email
    if (email.sender === undefined) {
        document.querySelector('#compose-subject').focus();
        document.querySelector('#compose-recipients').value = '';
        document.querySelector('#compose-subject').value = '';
        document.querySelector('#compose-body').value = '';
    } else {
        document.querySelector('#compose-recipients').value = email.sender;
        document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
        document.querySelector('#compose-body').value = `
            On ${email.timestamp}, ${email.sender} wrote:
            ${email.body} 
            ------------------------------------------------------------------------------ \n
            `;
        document.querySelector('#compose-body').focus();

    };
}


function load_mailbox(mailbox) {

    // Object declaration for views
    const viewsObject = {
        emailsView: document.querySelector('#emails-view'),
        composeView: document.querySelector('#compose-view'),
        readView: document.querySelector('#read-view'),
        sentView: document.querySelector('#sent-view'),
        archivedView: document.querySelector('#archived-view'),
    };

    // Show the mailbox and hide other views
    viewsObject.emailsView.style.display = 'block';
    viewsObject.composeView.style.display = 'none';
    viewsObject.readView.style.display = 'none';
    viewsObject.sentView.style.display = 'none';
    viewsObject.archivedView.style.display = 'none';


    // Show the mailbox name
    viewsObject.emailsView.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    // Show the mailbox content
    fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .then(emails => {
            emails.forEach(email => {
                if (email.read === true) {
                    viewsObject.emailsView.innerHTML += `   
            <div class="row border border-primary p-1 m-2 emailRow" style="border-radius: 5px;">  
                    <div class="col-5 text-decoration-none">
                        <p class="float-start"> <small class="text-muted"> From: </small>
                        <strong><a href="#" onclick="readEmail('${email.id}')">
                        ${email.sender}</a></strong></p>
                    </div>
                    <div class="col-auto text-truncate">
                        <p><a href="#" onclick="readEmail('${email.id}')">
                           <small class="text-muted"> Subject: </small> ${email.subject} <small class="text-muted m-1">${email.timestamp}</small></a></p>
                    </div>               
            </div>    
        `;
                    gsap.to(".row", 1, {
                        scale: 1.1,
                        onComplete: function() {
                            gsap.to(".row", 1, {
                                scale: 1,
                                ease: Power4.easeIn,
                            });
                        }
                    });
                    gsap.to(".btn", 1, {
                        scale: 1.1,
                        onComplete: function() {
                            gsap.to(".btn", 1, {
                                scale: 1,
                                ease: Power4.easeIn,
                            });
                        }
                    });
                } else {
                    viewsObject.emailsView.innerHTML += `     
            <div class="row bg-secondary bg-opacity-50 p-2 m-2 emailRow" style="border-radius: 5px;">           
                    <div class="col-5 text-decoration-none">
                        <p class="float-start"> <small class="text-muted">From:</small>
                        <strong><a href="#" onclick="readEmail('${email.id}')">
                        ${email.sender}</a></strong></p>
                    </div>
                    <div class="col-auto text-truncate">
                        <p><a href="#" onclick="readEmail('${email.id}')">
                            <small class="text-muted"> Subject: </small> ${email.subject} <small class="text-muted m-1">${email.timestamp}</small></a></p>
                    </div>
            </div>
        `;
                    gsap.to(".row", 1, {
                        scale: 1.1,
                        onComplete: function() {
                            gsap.to(".row", 1, {
                                scale: 1,
                                ease: Power4.easeIn,
                            });
                        }
                    });
                    gsap.to(".btn", 1, {
                        scale: 1.1,
                        onComplete: function() {
                            gsap.to(".btn", 1, {
                                scale: 1,
                                ease: Power4.easeIn,
                            });
                        }
                    });
                }
            });
        });
}

function send_email() {

    // Get the values from the form
    const data = {
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value,
        read: false,
    };

    // Send the email
    fetch('/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
    load_mailbox('sent');
}

function readEmail(id) {

    // Show the email and hide other views
    document.querySelector('#read-view').style.display = 'block';
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#sent-view').style.display = 'none';
    document.querySelector('#archived-view').style.display = 'none';

    // Show the email content
    fetch(`/emails/${id}`)
        .then(response => response.json())
        .then(email => {
            document.querySelector('#read-view').innerHTML = "";
            document.querySelector("#read-view").innerHTML += `
            <div class="email-item container">
                <div class="row m-2">
                <div class="email-header col-12 mt-2 border-end border-start  border-top">
                  <p><small> From:  </small><strong>${email.sender}</strong></p>
                </div>
                </div>
                <div class="row m-2">
                <div class="email-header col-12 border-end border-start">
                  <p><small> Recipients:  </small><strong>${email.recipients}</strong></p>
                </div>
                </div>
                <div class="row m-2">
                    <div class="read-sender  col-12 border-end border-start" id="read-sender">
                      <p><small> Sent: ${email.timestamp}</small></p>
                    </div>
                    </div>
                    <div class="row m-2">
                    <div class="read-subject col-12 mb-2 border-end border-start border-bottom" id="read-subject">
                     <p><small> Subject: </small></p><p><strong>${email.subject}</strong></p>
                    </div>
                </div>
                <div class="row m-2">
                <div class="buttons col-12 p-2 border-end border-start" id="buttons">
                <span class="archive" id="archive">
                </span>
                <span class="reply" id="reply">
                </span>
                <btn class="btn btn-primary" onclick="delete_email('${email.id}')">Delete</btn>
                <btn class="btn btn-primary" onclick="forward_email('${email.id}')">Forward</btn>
                </div>
                </div>
                <div class="row m-2">
                <div class="read-body col-12 mt-2 p-2 border" id="read-body">
                   <p class="lead">${email.body}</p>
                </div>
                </div>        
                </div>        
        `;

            // Add Unarchive/Archive button
            document.querySelector('#archive').innerHTML = "";
            if (email.archived === true) {
                const element = document.createElement('btn');
                element.innerHTML = 'Unarchive';
                element.className = 'btn btn-primary';
                element.addEventListener('click', () => {
                    un_archive_email(email.id);
                });
                document.querySelector('#archive').append(element);
            } else {
                const element = document.createElement('btn');
                element.innerHTML = 'Archive';
                element.className = 'btn btn-primary';
                element.addEventListener('click', () => {
                    archive_email(email.id);
                });
                document.querySelector('#archive').append(element);
            }

            // Add Reply button
            document.querySelector('#reply').innerHTML = "";
            const replyElm = document.createElement('btn');
            replyElm.innerHTML = 'Reply';
            replyElm.className = 'btn btn-primary';
            replyElm.addEventListener('click', () => {
                reply(email.id);
            });
            document.querySelector('#reply').append(replyElm);
            mark_read(email.id);
            gsap.to(".btn", 1, {
                scale: 1.1,
                onComplete: function() {
                    gsap.to(".btn", 1, {
                        scale: 1,
                        ease: Power4.easeIn,
                    });
                }
            });
        }).catch(error => {
            console.error('Error:', error);
        });

}

function archive_email(id) {

    // Update the server
    fetch(`/emails/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            archived: true
        })
    })
    console.log('Success: archived');
    window.location.reload();
}

function un_archive_email(id) {

    // Update the server
    fetch(`/emails/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            archived: false
        })
    })
    console.log('Success: unarchived');
    window.location.reload();
}

function reply(id) {
    fetch(`/emails/${id}`)
        .then(response => response.json())
        .then(email => {
            compose_email(email);
        }).catch(error => {
            console.error('Error:', error);
        });
}

function mark_read(id) {
    fetch(`/emails/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            read: true
        })
    })
    console.log('Success: marked as read');
}