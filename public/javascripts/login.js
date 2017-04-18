/**
 * Created by Kales on 4/17/2017.
 */

let loginButton = document.getElementById('loginButton');
let inputBoxUsername = document.getElementById('username');
let inputBoxPassword = document.getElementById('password');
let body = document.getElementById('body');
let header = document.getElementById('resultvar');

function login(e)
{
    let xhr = new XMLHttpRequest();
    let encoded = encodeURIComponent('./login?username='+inputBoxUsername.value+'&password='+inputBoxPassword.value);
    xhr.open('get','./login?username='+inputBoxUsername.value+'&password='+inputBoxPassword.value,true);
    console.log('just outside');
    xhr.onreadystatechange = function()
    {
        console.log('but i made it here');
        if(xhr.status == 200 &&xhr.readyState === XMLHttpRequest.DONE )
        {
            let res = JSON.parse(xhr.response);

            if(res.complete == true)
            {
                header.innerHTML = "<h3>"+res.items+"<\h3></\h3>";
                console.log('yo Im here');
            }
            else
            {
                console.log(res.err);
            }


        }
    };
    xhr.send()
}
loginButton.addEventListener("click",login,false);
