(async () => {
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    console.log('build template');
    const dates = (() => {
        const d72 = { year: 2019, month: 7, day: 2 };
        const d7 = { year: 2019, month: 7, day: 1 };
        return [
            '07',
            '7',
            // 'february',
            // 'feb',
            // 'February',
            // 'Feb',
            // 'FEBRUARY',
            // 'FEB',
        ].reduce(
            (p, m) => [
                ...p,
                ...['-', '/', ' ', ',', ', '].reduce(
                    (pp, d) => [
                        ...pp,
                        ...[
                            { s: `2019${d}${m}${d}02`, ...d72 },
                            { s: `2019${d}${m}${d}2`, ...d72 },
                            { s: `2019${d}${m}`, ...d7 },
                            { s: `2019${d}${m}`, ...d7 },
                            { s: `02${d}${m}${d}2019`, ...d72 },
                            { s: `2${d}${m}${d}2019`, ...d72 }
                        ]
                    ],
                    []
                )
            ],
            []
        );
    })();
    const timePrefixes = [' ', 'T', 'T '];
    const times = [
        { s: '01:02:03', hour: 1, minute: 2, second: 3, ms: 0 },
        { s: '01:02:03.456', hour: 1, minute: 2, second: 3, ms: 456 },
        // { s: '01:02:03.056', hour: 1, minute: 2, second: 3, ms: 56 },
        // { s: '01:02:03.006', hour: 1, minute: 2, second: 3, ms: 6 },
        { s: '1:2:3', hour: 1, minute: 2, second: 3, ms: 0 },
        { s: '1:2:3.456', hour: 1, minute: 2, second: 3, ms: 456 },
        // { s: '1:2:3.56', hour: 1, minute: 2, second: 3, ms: 56 },
        // { s: '1:2:3.6', hour: 1, minute: 2, second: 3, ms: 6 },
    ].reduce(
        (p, c) => [
            ...p,
            { ...c },
            { ...c, s: `${c.s}Z` },
            { ...c, s: `${c.s}GMT` },
            { ...c, s: `${c.s}Z GMT` },
        ],
        []
    );

    console.log('build list');
    const consoleText = document.getElementById('console');
    const listMaxLength = dates.length * timePrefixes.length * times.length;
    let list = [];
    let index = 0, add = {};
    for (let d of dates) {
        for (let tp of timePrefixes) {
            for (let t of times) {
                index++;
                add = {
                    ...d,
                    ...t,
                    s: `${d.s}${tp}${t.s}`
                };
                list = [
                    ...list,
                    add
                ];
                consoleText.innerText = `building... ${(index / listMaxLength) *
                    100} %`;
                await sleep(1);
            }
        }
    }

    console.log({ list });

    console.log('analyze list');
    index = 0;
    let result = {
        invalid: [],
        ok: [],
        ng: []
    };
    for (let l of list) {
        index++;
        const { s, year, month, day, hour, minute, second, ms } = l;
        const d = new Date(s);
        const ex = {
            year,
            month,
            day,
            hour,
            minute,
            second,
            ms
        };
        const res = {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate(),
            hour: d.getHours(),
            minute: d.getMinutes(),
            second: d.getSeconds(),
            ms: d.getMilliseconds()
        };
        const json = {
            ex: JSON.stringify(ex),
            res: JSON.stringify(res)
        }
        const domOK = `<table>
            <thead><tr><th>${s}</th></tr></thead>
            <tbody></tbody>
        </table>`;
        const dom = `<table>
            <thead><tr><th>${s}</th></tr></thead>
            <tbody>
                <tr><th>ANSWER</th><th>${json.res}</th></tr>
                <tr><th>EXPECT</th><th>${json.ex}</th></tr>
            </tbody>
        </table>`;
        if(d.toString()==="Invalid Date"){
            result.invalid = [...result.invalid, s];
            document.getElementById('id').innerHTML += dom;
        }else{
            if (json.ex === json.res) {
                result.ok = [...result.ok, s];
                document.getElementById('ok').innerHTML += domOK;
            } else {
                result.ng = [...result.ng, s];
                document.getElementById('ng').innerHTML += dom;
            }
        }
        consoleText.innerText = `analyzing... ${(index / listMaxLength) *
            100} %`;
        await sleep(1);
    }
    console.log(result)
    consoleText.innerText = `OK: ${result.ok.length}, invalid: ${result.invalid.length}, NG: ${result.ng.length}`
})();
