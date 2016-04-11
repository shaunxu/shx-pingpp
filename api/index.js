(function () {
    'use strict';

    exports.initialize = function (app, logger) {

        var uuid = require('node-uuid');
        var randomstring = require("randomstring");
        var ipaddr = require('ipaddr.js');
        var pingpp = require('pingpp')('sk_test_abDyPC8G8840GGGCOKfnX18G');

        app.post('/api/pay', function (req, res, next) {
            console.log(JSON.stringify({
                ip: req.ip,
                ips: req.ips,
                result: ipaddr.parse(req.ip).toString()
            }, null, 2));

            pingpp.charges.create({
                subject: 'Worktile',
                body: '企业版付费',
                amount: req.body.amount,
                order_no: randomstring.generate({
                    length: 19,
                    charset: 'alphanumeric'
                }),
                channel: 'alipay_pc_direct',
                currency: 'cny',
                client_ip: (req.ip && req.ip !== '::1') ? req.ip : '127.0.0.1',
                app: {
                    id: 'app_5mbLi9zbTeX19qvf'
                },
                extra: {
                    success_url: 'http://shx-pingpp.azurewebsites.net/success.html'
                }
            }, function (error, charge) {
                if (error) {
                    res.status(500).send(error);
                }
                else {
                    console.log('CHARGE = ' + JSON.stringify(charge, null, 2));

                    res.send(charge);
                }
            });
        });

        app.post('/api/webhooks/pingpp', function (req, res, next) {
            var event = req.body;
            if (event) {
                switch (event.type) {
                    case 'summary.daily.available':
                        res.sendStatus(200);
                        break;
                    case 'summary.weekly.available':
                        res.sendStatus(200);
                        break;
                    case 'summary.monthly.available':
                        res.sendStatus(200);
                        break;
                    case 'charge.succeeded':
                        console.log('WEBHOOK = ' + JSON.stringify(event, null, 2));
                        res.sendStatus(200);
                        break;
                    case 'refund.succeeded':
                        res.sendStatus(200);
                        break;
                    case 'transfer.succeeded':
                        res.sendStatus(200);
                        break;
                    case 'red_envelope.sent':
                        res.sendStatus(200);
                        break;
                    case 'red_envelope.received':
                        res.sendStatus(200);
                        break;
                    default:
                        res.status(400).send('Invalid type value (' + event.type + ').');
                        break;
                }
            }
            else {
                res.status(400).send('No request body detected.');
            }

        });
    };

})();