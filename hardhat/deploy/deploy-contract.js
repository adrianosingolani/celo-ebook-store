module.exports = async ({getNamedAccounts, deployments}) => {
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();
  await deploy('EbookStore', {
    from: deployer,
    // args: ["hello world"],
    log: true,
  });
};
module.exports.tags = ['EbookStore'];