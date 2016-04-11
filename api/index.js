(function () {
    'use strict';

    exports.initialize = function (app, logger) {

        var uuid = require('node-uuid');
        var randomstring = require("randomstring");
        var pingpp = require('pingpp')('sk_test_abDyPC8G8840GGGCOKfnX18G');

        app.post('/api/pay', function (req, res, next) {
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
                client_ip: req.ip === '::1' ? '127.0.0.1' : req.ip,
                app: {
                    id: 'app_5mbLi9zbTeX19qvf'
                },
                extra: {
                    success_url: 'http://pro.wortile.com/success.html'
                }
            }, function (error, charge) {
                if (error) {
                    res.status(500).send(error);
                }
                else {
                    res.send(charge);
                }
            });
        });

    };

})();