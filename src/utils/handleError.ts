
const handleError = (err, res) => {
    console.log(err);
    if(!!err.httpCode)
    {
        res.status(err.httpCode).send({ error: err })
    }
    else if (!!err.details)
    {
        res.status(400).send({ error: err })
    }
    else{
        res.status(500).send({ error: err })
    }
};

export default handleError;