# Tendermint exporter
## Description
Using the standard Tendermint Prometheus exporter, our team found that sometimes the validator miss counter works abnormally: it starts showing missed blocks and increasing their number continuously despite the fact that the validator performs well. Furthermore, this issue can not be solved without recreating the validator.
We developed a simple and easy-to-use tool that allows you to retrieve the correct data about validator missed blocks via a request to the blockchain API.

## Getting Started
This is instructions for installing and launching our custom exporter on your local machine for development and testing purposes.

## Running the application

### Prerequisites
- [Node.js](https://nodejs.org)

#### Step 1: Clone this repo to your server and change the directory.
```shell
git clone https://github.com/stakeflow/tendermint-custom-exporter
cd tendermint-custom-exporter
```
#### All further actions are performed in the tendermint-custom-exporter folder. 

#### Step 2: Install npm dependencies 
```shell
npm install
```

#### Step 3: Exporter config
Copy the ".env.example" file to the ".env" and make changes in ".env" according to your needs.
```shell
cp .env.example .env
```

#### Step 4: Create a systemd service file
```shell
tee $HOME/exporterd.service > /dev/null <<EOF
[Unit]
  Description=Validator missed blocks counter
  After=network-online.target
[Service]
  User=$USER
  WorkingDirectory=$(pwd)
  ExecStart=$(which node) $(readlink -f index.js)
  Restart=on-failure
  RestartSec=10
  LimitNOFILE=65535
[Install]
  WantedBy=multi-user.target
EOF
```

#### Step 5: Copy the systemd file to the working directory and start the exporter
```shell
sudo mv $HOME/exporterd.service /etc/systemd/system/
sudo systemctl enable exporterd
sudo systemctl daemon-reload
sudo systemctl start exporterd
sudo journalctl -u exporterd -f -o cat
```
