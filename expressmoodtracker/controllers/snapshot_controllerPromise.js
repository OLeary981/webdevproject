const conn = require("./../util/dbconn");

exports.getIndex = (req, res) => { 
    const { error } = req.query;
    res.render("index", { error });    
};

exports.getAbout = (req, res) => {
    const { error } = req.query;
    res.render("about",  { error }); 
};

exports.getAddSnapshot = async (req, res) => { 
    const { message } = req.query;
    const welcomeMessage = message || `How are you feeling?`;
    try {
        const [triggers] = await conn.query("SELECT * FROM `trigger` ORDER BY trigger_name ASC");
        res.render("addsnapshotcheckboxes", { triggers, currentPage: "/newsnapshot", message: welcomeMessage });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching triggers");
    }
};

exports.getEditSnapshot = async (req, res) => {
    try {
        const { id } = req.params;
        const [snapshot] = await conn.query(`SELECT snapshot_ID, enjoyment_level, surprise_level, contempt_level, sadness_level, fear_level, disgust_level, anger_level, timestamp FROM snapshot WHERE snapshot_ID = ?`, [id]);
        const [triggers] = await conn.query("SELECT * FROM `trigger` ORDER BY trigger_name ASC");
        const [selectedTriggers] = await conn.query(`SELECT t.trigger_name FROM snapshot_trigger st JOIN \`trigger\` t ON st.trigger_ID = t.trigger_ID WHERE st.snapshot_ID = ?`, [id]);
        res.render("editsnapshotcheckboxes", { snapshot, triggers, selectedTriggers });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render('404', { error });
    }
};

exports.getSingleSnapshot = async (req, res) => {
    const { id } = req.params;
    const { user_ID } = req.session;

    try {
        const [snapshotResult] = await conn.query(`SELECT * FROM snapshot WHERE snapshot_id = ? AND user_ID = ?`, [id, user_ID]);
        if (snapshotResult.length > 0) {
            const [triggers] = await conn.query(`SELECT t.trigger_name FROM snapshot_trigger st JOIN \`trigger\` t ON st.trigger_ID = t.trigger_ID WHERE st.snapshot_ID = ?`, [id]);
            res.render("singlesnapshot", { result: snapshotResult, triggers });
        } else {
            res.render('404');
        }
    } catch (error) {
        console.error("Error fetching snapshot:", error);
        res.render('404', { error });
    }
};

exports.getAllSnapshotsSimplified = async (req, res) => {
    const { user_ID, first_name } = req.session;
    const vals = user_ID;

    try {
        const [results] = await conn.query(`SELECT * FROM snapshot WHERE user_id = ? ORDER BY timestamp`, [vals]);
        if (results.length === 0) {
            const welcomeMessage = `Welcome to mood tracker ${first_name}! Add the first snapshot of your emotions to get started!`;
            return res.redirect(`/newsnapshot?message=${encodeURIComponent(welcomeMessage)}`);
        }
        console.log("About to render allSnapshots");
        console.log(results);
        console.log(req.session.first_name);
        res.render('overview', {
            snapshots: results,
            currentPage: '/allsnapshots',
            session: req.session // Assuming you have a way to determine if the user is logged in
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

exports.getLanding = (req, res) => {
    const { isLoggedIn } = req.session;
    res.render("landing", { currentPage: "/landing", isLoggedIn, error: null });
};

exports.postAddSnapshot = async (req, res) => {
    const { user_ID } = req.session;
    const { enjoyment, surprise, contempt, sadness, fear, disgust, anger, notes } = req.body;
    const formTriggers = req.body.triggers || [];

    const notesValue = notes ? notes : null;

    try {
        await conn.beginTransaction();
        const timestamp = new Date();
        const [insertResult] = await conn.query(`INSERT INTO snapshot (enjoyment_level, surprise_level, contempt_level, sadness_level, fear_level, disgust_level, anger_level, user_id, timestamp, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [enjoyment, surprise, contempt, sadness, fear, disgust, anger, user_ID, timestamp, notesValue]);
        const snapshot_ID = insertResult.insertId;

        const [triggerResults] = await conn.query(`SELECT trigger_ID FROM \`trigger\` WHERE trigger_name IN (?)`, [formTriggers]);

        for (const row of triggerResults) {
            await conn.query(`INSERT INTO snapshot_trigger (snapshot_ID, trigger_ID) VALUES (?, ?)`, [snapshot_ID, row.trigger_ID]);
        }

        await conn.commit();
        console.log("Transaction successfully committed");
        res.redirect(`/singlesnapshot/${snapshot_ID}`);
    } catch (error) {
        console.error("Error adding snapshot:", error);
        await conn.rollback();
        res.status(500).send("Error adding snapshot");
    }
};

exports.postEditSnapshot = async (req, res) => {
    const { user_ID } = req.session;
    const { id: snapshot_ID } = req.params;
    const { enjoyment, surprise, contempt, sadness, fear, disgust, anger, notes } = req.body;
    const formTriggers = req.body.triggers;

    const notesValue = notes ? notes : null;

    try {
        await conn.beginTransaction();
        await conn.query(`UPDATE snapshot SET enjoyment_level=?, surprise_level=?, contempt_level=?, sadness_level=?, fear_level=?, disgust_level=?, anger_level=?, notes=? WHERE snapshot_ID=? AND user_id=?`, [enjoyment, surprise, contempt, sadness, fear, disgust, anger, notesValue, snapshot_ID, user_ID]);

        const [triggerResults] = await conn.query(`SELECT trigger_ID FROM \`trigger\` WHERE trigger_name IN (?)`, [formTriggers]);

        await conn.query(`DELETE FROM snapshot_trigger WHERE snapshot_ID = ?`, [snapshot_ID]);

        for (const row of triggerResults) {
            await conn.query(`INSERT INTO snapshot_trigger (snapshot_ID, trigger_ID) VALUES (?, ?)`, [snapshot_ID, row.trigger_ID]);
        }

        await conn.commit();
        console.log("Transaction successfully committed");
        res.redirect(`/singlesnapshot/${snapshot_ID}`);
    } catch (error) {
        console.error("Error editing snapshot:", error);
        await conn.rollback();
        res.status(500).send("Error editing snapshot");
    }
};

exports.postDeleteSnapshot = async (req, res) => {
    const { id: snapshot_ID } = req.params;
    const { user_ID } = req.session;
    try {
        await conn.query(`DELETE FROM snapshot WHERE snapshot_ID = ? AND user_ID = ?`, [snapshot_ID, user_ID]);
        res.redirect("/allsnapshots");
    } catch (error) {
        console.error("Error deleting snapshot:", error);
        res.status(500).send("Error deleting snapshot");
    }
};
