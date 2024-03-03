
const axios = require('axios');

exports.getAllFavourites = (req, res) => {

    const endpoint = `http://localhost:3002/favourites`;

    axios
        .get(endpoint)
        .then((response) => {
            const data = response.data.result;
            res.render('index', { result: data });
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        });
};

//added GET /editfav route method
exports.getEditFavourites = (req, res) => {

    const endpoint = `http://localhost:3002/favourites`;

    axios
        .get(endpoint)
        .then((response) => {
            const data = response.data.result;
            res.render('editfavourites', { result: data });
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        });
};

//added GET /editfav/:id route method
exports.getEditSingleFavourite = (req, res) => {

    const { id } = req.params;

    const endpoint = `http://localhost:3002/favourites/${id}`;

    axios
        .get(endpoint, { validateStatus: (status) => { return status < 500 } })
        .then((response) => {
            const status = response.status;
            if (status === 200) {
                const data = response.data.result;
                res.render('editsinglefavourite', { result: data });
            } else {
                console.log(response.status);
                console.log(response.data);
                res.redirect('/editfav');
            }
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        }); 
};

exports.getDeleteSingleFavourite = (req, res) => {

    const { id } = req.params;

    const endpoint = `http://localhost:3002/favourites/${id}`;

    axios
        .get(endpoint, { validateStatus: (status) => { return status < 500 } })
        .then((response) => {
            const status = response.status;
            if (status === 200) {
                const data = response.data.result;
                res.render('deletesinglefavourite', { result: data });
            } else {
                console.log(response.status);
                console.log(response.data);
                res.redirect('/editfav');
            }
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        }); 
};


exports.getAddFavourite = (req, res) => {
    
    res.render('addfavourite');
};

exports.postInsertFavourite = (req, res) => {

    const vals = { myname, myfoodtype } = req.body;

    const endpoint = `http://localhost:3002/favourites`;

    axios
        .post(endpoint, vals)
        .then((response) => {
            res.redirect('/');
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        });
};

exports.postUpdateFavourite = (req, res) => {

    const { id } = req.params;
    const vals = { myname, myfoodtype } = req.body;

    const endpoint = `http://localhost:3002/favourites/${id}`;

    axios
        .put(endpoint, vals, { validateStatus: (status) => { return status < 500 } })
        .then((response) => {
            const status = response.status;
            if (status === 200) {
                res.redirect('/editfav');
            } else {
                console.log(response.status);
                console.log(response.data);
                res.redirect('/editfav');
            }
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        }); 
};

exports.postDeleteFavourite = (req, res) => {

    const { id } = req.params;

    const endpoint = `http://localhost:3002/favourites/${id}`;

    axios
        .delete(endpoint, { validateStatus: (status) => { return status < 500 } })
        .then((response) => {
            const status = response.status;
            if (status === 200) {
                res.redirect('/editfav');
            } else {
                console.log(response.status);
                console.log(response.data);
                res.redirect('/editfav');
            }
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        });
};