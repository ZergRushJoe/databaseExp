let button = document.getElementById('submitButton');
let inputBox = document.getElementById('text');
let body = document.getElementById('tbody');

function search(e)
{
    let xhr = new XMLHttpRequest();
    xhr.open('get','./search?name='+inputBox.value,true);
    xhr.onreadystatechange = function()
    {

        if(xhr.status == 200 &&xhr.readyState === XMLHttpRequest.DONE )
        {
            let res = JSON.parse(xhr.response);

            if(res.complete == true)
            {
                let items = res.items;
                body.innerHTML = "";
                if(items.length>0)
                {

                    for(let i = 0;i<items.length;i++)
                    {
                        body.innerHTML +=
                            `
                    <tr>
                        <th class = "alignRight">${items[i].id || items[i].item_id}</th>
                        <th class = "alignLeft">${items[i].name || items[i].item_name}</th>
                        <th class = "alignLeft">${items[i].quantity}</th>
                    </tr>
                   `
                    }
                }
            }
            else
            {
                console.log(res.err);
            }

        }
    };
    xhr.send()
}
button.addEventListener("click",search,false);
