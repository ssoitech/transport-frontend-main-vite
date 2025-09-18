import React, { useState } from 'react'
import FillingStationPump from './FillingStationPump';
import FillingStationPumpRate from './FillingStationPumpRate';

function FillingStation() {
    const [displayPump, setDisplayPump] = useState(true);
    const [displayRate, setDisplayRate] = useState(false);
    function handleClickPump() {
        if (displayRate) {
            setDisplayRate(false);
            setDisplayPump(true);
        }
    }
    function handleClickRate() {
        if (displayPump) {
            setDisplayPump(false);
            setDisplayRate(true);
        }
    }
    return (
        // <Tabs
        //     defaultActiveKey="filling-station-pump"
        //     id="fill-tab-example"
        //     className="mb-3"
        //     fill
        // >
        //     <Tab eventKey="filling-station-pump" title="Pump">
        //         <FillingStationPump />
        //     </Tab>
        //     <Tab eventKey="pump-rate" title="Rate">
        //         <FillingStationPumpRate />
        //     </Tab>
        // </Tabs>
        <div className='container text-center'>
            {/* <button type="button" className="btn btn-sm btn-primary ml-4 mb-4" onClick={handleClickPump}>Pump</button>
            <button type="button" className="btn btn-sm btn-secondary ml-4 mb-4" onClick={handleClickRate}>Rate</button> */}

            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked={displayPump} onClick={handleClickPump} />
                <label class="btn btn-outline-secondary" for="btnradio1">Pump</label>

                <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autocomplete="off" checked={displayRate} onClick={handleClickRate} />
                <label class="btn btn-outline-secondary" for="btnradio2">Rate</label>
            </div>

            <div>
                {displayPump && <FillingStationPump />}
                {displayRate && <FillingStationPumpRate />}
            </div>
        </div>
    )
}

export default FillingStation
