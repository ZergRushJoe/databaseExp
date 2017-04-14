/**
 * Created by joe12 on 4/14/2017.
 */
let button = document.getElementById('submitButton');
let nameBox = document.getElementById('name');
let quantityBox = document.getElementById('quantity');


function search(e)
{
    let xhr = new XMLHttpRequest();
    xhr.open('POST','./insert',true);
    xhr.onreadystatechange = function()
    {
        if(xhr.status == 200 &&xhr.readyState === XMLHttpRequest.DONE )
        {
            let res = JSON.parse(xhr.response);
            if(res.complete == true)
            {
                alert("complete")
            }
            else
            {
                alert(JSON.stringify(res.err))
            }

        }
    };
    xhr.send(JSON.stringify({name:nameBox.value,quantity:quantityBox.value}))
}
button.addEventListener("click",search,false);
