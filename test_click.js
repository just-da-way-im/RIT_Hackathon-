import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
    fs.writeFileSync('clean_out.log', '');
    const log = (msg) => { fs.appendFileSync('clean_out.log', msg + '\n'); console.log(msg); };

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', msg => {
        log(`BROWSER_LOG: ${msg.type().toUpperCase()} ${msg.text()}`);
    });
    page.on('pageerror', err => {
        log(`BROWSER_ERROR: ${err.message}`);
    });

    log("Navigating to dashboard...");
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

    console.log("Looking for Login button...");
    const loginBtns = await page.$$('button');
    let loginBtn = null;
    for (let btn of loginBtns) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text.includes('Log In to Dashboard')) {
            loginBtn = btn;
            break;
        }
    }

    if (loginBtn) {
        console.log("Clicking Login via Home Page...");
        await loginBtn.click();
        await new Promise(r => setTimeout(r, 1000));

        console.log("Filling login form...");
        await page.type('input[type="email"]', 'test8@test.com');
        await page.type('input[type="password"]', 'password123');

        const summitBtns = await page.$$('button');
        for (let btn of summitBtns) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text.includes('Log In →')) {
                await btn.click();
                break;
            }
        }

        console.log("Waiting for Dashboard to load...");
        await new Promise(r => setTimeout(r, 3000));

        console.log("Looking for Roommates Tab...");
        const sidebarBtns = await page.$$('.nav-item');
        let roommatesBtn = null;
        for (let btn of sidebarBtns) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text.includes('Roommates')) {
                roommatesBtn = btn;
                break;
            }
        }

        if (roommatesBtn) {
            console.log("Clicking Roommates Tab...");
            await roommatesBtn.click();
            await new Promise(r => setTimeout(r, 2000));
        } else {
            console.log("Roommates tab not found. Found:");
            for (let btn of sidebarBtns) {
                console.log(await page.evaluate(el => el.textContent, btn));
            }
        }
    } else {
        console.log("Login button not found.");
    }

    await browser.close();
})();
