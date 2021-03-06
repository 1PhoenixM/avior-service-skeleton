//Aggregate stats

module.exports = {
	identity: 'aggregate',

	connection: ['util'],

	attributes: {
        DPID: {
            type: 'string',
            required: true,
            primaryKey: true
        },
		PacketCount: {
			type: 'integer',
			required: true
		},
        ByteCount: {
			type: 'integer',
			required: true
		},
        FlowCount: {
			type: 'integer',
			required: true
		},
    }
}