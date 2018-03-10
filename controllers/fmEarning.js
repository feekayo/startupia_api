let Sessions = require('../models/sessions'),

    Startups = require('../models/startups'),
    fmEarning = require('../models/fmEarning').fmEarningModel,
    ERR = require('../commons/errorResponse'),
    SUCCESS = require('../commons/successResponse')

/**

 * @type {Array}
 */
let required_fileds = [
    'startup_id', 'log_message', 'earning', 'source'
];
module.exports = {
    delete: function (request, response) {
        //Next Step is to validat session

        Sessions.validate(request.params.session_id, request.body.user_id, ((validated) => {

            return fmEarning.findByIdAndRemove(
                request.params.earn_id,
                (err, data) => {
                    if (!err) {

                        return response.status(200).json(SUCCESS('successfuly rempved'));
                    } else {

                        return response.status(500).json(ERR(err));
                    }
                });

        }));

    },

    update: function (request, response) {
        //Next Step is to validat session

        Sessions.validate(request.params.session_id, request.body.user_id, ((validated) => {

            return fmEarning.findByIdAndUpdate(
                request.params.earn_id,
                request.body,
                {new: true},
                (err, data) => {
                    if (!err) {

                        return response.status(200).json(SUCCESS(data));
                    } else {

                        return response.status(500).json(ERR(err));
                    }
                });

        }));

    },

    create: function (request, response) {
        let err = false;
        //make sure all the required fields were sent
        required_fileds.map(field => {

            if (typeof(request.body[field]) === 'undefined' || request.body[field].length < 1) {
                err = true;
                return response.status(400).json(ERR(`${field} is missing`));
            }
        });

        //Next Step is to validat session
        if (err === false) {
            Sessions.validate(request.params.session_id, request.body.user_id, ((validated) => {
                /*console.log(fmEarning)
                return response.json(fmEarning)*/
                let earning = new fmEarning(request.body);
                return earning.save((err, data) => {
                    if (!err) {
                        console.log(data);
                        return response.status(200).json(SUCCESS(data));
                    } else {
                        console.log('I am errornous')
                        return response.status(500).json(ERR('sorry, something is not quite right. Please try again'));
                    }
                });
                //if (validated) {
                return fmEarning.create(request.body, (err, data) => {
                    if (!err) {
                        console.log(data);
                        return response.status(200).json(SUCCESS(data));
                    } else {
                        console.log('I am errornous')
                        return response.status(500).json(ERR('sorry, something is not quite right. Please try again'));
                    }
                });
                /*}
                else {
                    return res.status(401).json(ERR('invalid session'));
                }*/
            }));
        }


    },
    findAll: function (request, response) {

        //Next Step is to validat session

        Sessions.validate(request.params.session_id, request.body.user_id, ((validated) => {

            return fmEarning.find(request.query, (err, data) => {
                if (!err) {

                    return response.status(200).json(SUCCESS(data));
                } else {

                    return response.status(500).json(ERR('sorry, something is not quite right. Please try again'));
                }
            });

        }));


    },


};