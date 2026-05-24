const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const UserStData = require('../models/userStDataModel');

const USER_DATA_DIR = path.join(__dirname, '../userData');

function detectOSType(csvContent) {

    const firstLine = csvContent.split('\n')[0].toLowerCase();

    // iOS CSV
    if (
        firstLine.includes('daily_total_hours') ||
        firstLine.includes('usage_seconds')
    ) {
        return 'iOS';
    }

    // Android CSV
    if (
        firstLine.includes('package_name') &&
        firstLine.includes('total_minutes')
    ) {
        return 'Android';
    }

    return null;
}

function extractDateFromFileName(fileName) {

    // iOS:
    // 2026-05-09.csv

    const match = fileName.match(
        /(\d{4}-\d{2}-\d{2})/
    );

    if (!match) {
        return null;
    }

    return new Date(match[1]);
}

async function processCsvFile(userId, fullFilePath, relativePath) {

    try {

        const csvContent = fs.readFileSync(
            fullFilePath,
            'utf8'
        );

        const osType = detectOSType(csvContent);

        if (!osType) {

            console.log(
                `Skipping unknown CSV format: ${relativePath}`
            );

            return;
        }

        let importedForDate = null;

        // iOS -> datum iz file name
        if (osType === 'iOS') {

            importedForDate = extractDateFromFileName(
                path.basename(fullFilePath)
            );
        }

        // Android -> datum iz exported_at
        else if (osType === 'Android') {

            const exportedAtMatch = csvContent.match(
                /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
            );

            if (exportedAtMatch) {

                const exportDate = new Date(
                    exportedAtMatch[0]
                );

                importedForDate = new Date(Date.UTC(
                    exportDate.getUTCFullYear(),
                    exportDate.getUTCMonth(),
                    exportDate.getUTCDate() - 1
                ));
            }
        }

        if (!importedForDate) {

            console.log(
                `Could not determine date: ${relativePath}`
            );

            return;
        }

        // prepreči duplicate vnose
        const existing = await UserStData.findOne({
            userId,
            storagePath: relativePath
        });

        if (existing) {

            console.log(
                `Already exists: ${relativePath}`
            );

            return;
        }

        const userStData = new UserStData({

            userId,

            storagePath: relativePath,

            importedForDate,

            typeOfOS: osType,

            isProcessed: false
        });

        await userStData.save();

        console.log(
            `Saved -> ${relativePath} (${osType})`
        );

    } catch (err) {

        console.error(
            `Failed processing: ${relativePath}`,
            err
        );
    }
}

async function scanUserFolders() {

    const userFolders = fs.readdirSync(
        USER_DATA_DIR,
        { withFileTypes: true }
    );

    for (const folder of userFolders) {

        if (!folder.isDirectory()) {
            continue;
        }

        const userId = folder.name;

        const userFolderPath = path.join(
            USER_DATA_DIR,
            userId
        );

        const files = fs.readdirSync(userFolderPath);

        for (const file of files) {

            if (!file.endsWith('.csv')) {
                continue;
            }

            const fullFilePath = path.join(
                userFolderPath,
                file
            );

            const relativePath = path.join(
                'userData',
                userId,
                file
            );

            await processCsvFile(
                userId,
                fullFilePath,
                relativePath
            );
        }
    }
}

async function run() {

    await mongoose.connect('mongodb://zigalebic02:jp8bQs3yA1FSR0sH@ac-rxpanwp-shard-00-00.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-01.yjssyxx.mongodb.net:27017,ac-rxpanwp-shard-00-02.yjssyxx.mongodb.net:27017/OptiMe?ssl=true&replicaSet=atlas-822hpm-shard-0&authSource=admin&appName=OptiMe');

    try {

        await scanUserFolders();

        console.log('All CSV files processed');

    } catch (err) {

        console.error(err);

    } finally {

        await mongoose.disconnect();
    }
}

run();