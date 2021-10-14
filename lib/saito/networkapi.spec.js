const { default: Big } = require('big.js');
const networkapi = require('./networkapi');
const crypto = require('./crypto');

let make_mock_hop = () => {
    return {
        from: "0336137faab3fd2ec606de4e0a6fb478ad29497e05be8caeb1079a69817ac1212a",
        to: "0336137faab3fd2ec606de4e0a6fb478ad29497e05be8caeb1079a69817ac1212a",
        sig: "7e636154468ac5fce8173d778d975295095a78212a64c9332b0b970f311fde42043446a626490429c5b9c4ae6b4691de3f9e7c36c5f27ebb41816228a77dc82b",
    };
}
let make_mock_slip = () => {
    return {
        publickey: "0336137faab3fd2ec606de4e0a6fb478ad29497e05be8caeb1079a69817ac1212a",
        uuid: "89b94f024b9678ec56745a076ad94f67533700e6f0344e37bfe0aa31f779760a",
        amount: Big('55555'),
        slip_ordinal: 1,
        slip_type: 254,
    };
}

let make_mock_tx = () => {
    return {
        signature: "7e636154468ac5fce8173d778d975295095a78212a64c9332b0b970f311fde42043446a626490429c5b9c4ae6b4691de3f9e7c36c5f27ebb41816228a77dc82b",
        timestamp: Big(1000),
        transaction_type: 1,
        message: new Uint8Array([1,2,3,4]),
        inputs: [
            make_mock_slip()
        ],
        outputs: [
            make_mock_slip()
        ],
        path: [
            make_mock_hop()
        ],
    };
}
test('serialize hop', () => {
    let mock_app = {};
    mock_app.crypto = new crypto();
    let network_module = new networkapi(mock_app);
    let mock_hop = make_mock_hop();
    
    let serialized_hop = network_module.serializeHop(mock_hop);
    let deserialized_hop = network_module.deserializeHop(serialized_hop);
    expect(mock_hop.from).toBe(deserialized_hop.from);
    expect(mock_hop.to).toBe(deserialized_hop.to);
    expect(mock_hop.sig).toBe(deserialized_hop.sig);

});

test('serialize slip', () => {
    let mock_app = {};
    mock_app.crypto = new crypto();
    let network_module = new networkapi(mock_app);
    let mock_slip = make_mock_slip();
    
    let serialized_slip = network_module.serializeSlip(mock_slip);
    let deserialized_slip = network_module.deserializeSlip(serialized_slip);
    expect(mock_slip.publickey).toBe(deserialized_slip.publickey);
    expect(mock_slip.uuid).toBe(deserialized_slip.uuid);
    expect(mock_slip.amount).toStrictEqual(deserialized_slip.amount);
    expect(deserialized_slip.slip_ordinal).toBe(1);
    expect(deserialized_slip.slip_type).toBe(254);
});

test('serialize tx', () => {
    let mock_app = {};
    mock_app.crypto = new crypto();
    let network_module = new networkapi(mock_app);
    let mock_tx = make_mock_tx();
    let serialized_tx = network_module.serializeTransaction(mock_tx);
    let deserialized_tx = network_module.deserializeTransaction(serialized_tx, 0);
    expect(mock_tx.signature).toBe(deserialized_tx.signature);
    expect(mock_tx.timestamp).toStrictEqual(deserialized_tx.timestamp);
    expect(mock_tx.transaction_type).toBe(deserialized_tx.transaction_type);
    expect(mock_tx.inputs[0]).toStrictEqual(deserialized_tx.inputs[0]);
    expect(mock_tx.outputs[0]).toStrictEqual(deserialized_tx.outputs[0]);
    expect(mock_tx.message).toStrictEqual(deserialized_tx.message);
    expect(mock_tx.path[0]).toStrictEqual(deserialized_tx.path[0]);
});

test('serialize block', () => {
    let mock_app = {};
    mock_app.crypto = new crypto();
    let network_module = new networkapi(mock_app);
    let mock_block = {
        id: Big(1),
        timestamp: Big(5555555),
        previous_block_hash: "89b94f024b9678ec56745a076ad94f67533700e6f0344e37bfe0aa31f779760a",
        creator: "0336137faab3fd2ec606de4e0a6fb478ad29497e05be8caeb1079a69817ac1212a",
        merkle_root: "89b94f024b9678ec56745a076ad94f67533700e6f0344e37bfe0aa31f779760a",
        signature: "7e636154468ac5fce8173d778d975295095a78212a64c9332b0b970f311fde42043446a626490429c5b9c4ae6b4691de3f9e7c36c5f27ebb41816228a77dc82b",
        treasury: Big(88),
        staking_treasury: Big(888),
        burnfee: Big(9999),
        difficulty: Big(42),
        transactions: [
            make_mock_tx()
        ]
    };
    let serialized_block = network_module.serializeBlock(mock_block);
    let deserialized_block = network_module.deserializeBlock(serialized_block);
    
    expect(mock_block.id).toStrictEqual(deserialized_block.id);
    expect(mock_block.timestamp).toStrictEqual(deserialized_block.timestamp);
    expect(mock_block.previous_block_hash).toBe(deserialized_block.previous_block_hash);
    expect(mock_block.creator).toBe(deserialized_block.creator);
    expect(mock_block.merkle_root).toBe(deserialized_block.merkle_root);
    expect(mock_block.signature).toBe(deserialized_block.signature);
    expect(mock_block.treasury).toStrictEqual(deserialized_block.treasury);
    expect(mock_block.burnfee).toStrictEqual(deserialized_block.burnfee);
    expect(mock_block.difficulty).toStrictEqual(deserialized_block.difficulty);
    expect(mock_block.transactions[0]).toStrictEqual(deserialized_block.transactions[0]);
});