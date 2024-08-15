const applicantsStatusSchema = (branch) => `
    (
        COAP VARCHAR(200) NOT NULL UNIQUE,
        Offered text,
        Accepted text,        
        OfferCat text,
        IsOfferPwd text,
        OfferedRound text,
        RetainRound text,
        RejectOrAcceptRound text,
        ManualUpdate text,
        branch VARCHAR(255) DEFAULT '${branch}',
        FOREIGN KEY (COAP) REFERENCES mtechappl (COAP)
    )
`;

module.exports = { applicantsStatusSchema };
