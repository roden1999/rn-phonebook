export default function ajaxPost(params) {
    var data =
        {
            Payload: params.data,
        };
    //fetch(window.apihost + params.url, http://localhost:5050/
     var url = 'http://10.0.2.2:5050/' + params.url
     return window.fetch(url,
        {
            credentials: 'same-origin', //params.credentials != null ?  : 'same-origin' include,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            //mode: 'no-cors',
            method: 'post',
            body: JSON.stringify(data)
        }).catch((err)=>
        {
            if( params.onError != null )
                params.onError(err);
            return { then: params.finally };
        })
        .then((response) => {
            if( !response.ok )
            {
                if( params.onError != null )
                    params.onError(response);	

                    return { then: params.finally }; // end/break the chain
                }
            return response.json(); 
        }).then((json) => {
            if( json.Status === "OK" )
            return params.onSuccess(JSON.parse(json.JsonData),params.sender);
        }).then( () =>
        {
            params.finally();
        });
    }