const client = require('prom-client');
const { exec } = require('child_process');
const axios = require('axios');

const nodeApi = process.env.NODE_API;
const binary = process.env.BINARY;

function validatorMissedBlocks(registry) {
    const gauge = new client.Gauge({
        name: 'validator_missed_blocks',
        help: 'Validator missed blocks counter',
        registers: [registry],
    });

    async function collectValidatorMissedBlocks() {
        exec(`${binary} tendermint show-address`, async (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            let valcons = stdout;
            try {
                const response = await axios.get(nodeApi + "/cosmos/slashing/v1beta1/signing_infos/" + valcons);
                const missed = response.data.val_signing_info.missed_blocks_counter;
                console.log(`Validator missed blocks: ${missed}`);
                gauge.set(parseFloat(missed));
            }
            catch (err) {
              console.log(err.message);
            }
        });
    }

    setInterval(collectValidatorMissedBlocks, 6000);
}

module.exports = (registry) => {
    validatorMissedBlocks(registry);
};
