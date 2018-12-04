'use strict';

const statusUp = 'UP';
const statusDown = 'DOWN';

class Healthcheck {

    health ({err, service, json}) {
        if (err) {
            return {name: service.name, status: statusDown, error: err.toString()};
        }
        return {name: service.name, status: json.status};
    }

    info ({err, json}) {
        if (err) {
            return {gitCommitId: err.toString()};
        }
        return {gitCommitId: json.git.commit.id};
    }

    status (healthDownstream) {
        return healthDownstream.every(service => service.status === statusUp) ? statusUp : statusDown;
    }
}

module.exports = Healthcheck;
