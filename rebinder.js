/*
8	Backspace
9	Tab
13	Enter / Return
16	Shift
17	Ctrl (Control)
18	Alt / Option
20	Caps Lock
27	Escape (Esc)
32	Spacebar
*/

(function() {
    'use strict';
    
    Game.registerMod('RebindMod', {
        name: 'Rebind Mod',
        version: '1.0.0',
        rebindings: {},
        
        init: function() {
            const mod = this;
            let mouseX = 0;
            let mouseY = 0;

            window.addEventListener('mousemove', (event) => {
                mouseX = event.clientX;
                mouseY = event.clientY;
            });

            function clickAtCurrentPosition(targetElement) {
                const element = targetElement || document.elementFromPoint(mouseX, mouseY);
                
                if (!element) return;

                const mouseDownEvent = new MouseEvent('mousedown', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    buttons: 1,
                    clientX: mouseX,
                    clientY: mouseY
                });

                element.dispatchEvent(mouseDownEvent);
            }

            function releaseAtCurrentPosition(targetElement) {
                const element = targetElement || document.elementFromPoint(mouseX, mouseY);
                
                if (!element) return;

                const eventOptions = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: mouseX,
                    clientY: mouseY
                };

                const mouseUpEvent = new MouseEvent('mouseup', eventOptions);
                const clickEvent = new MouseEvent('click', eventOptions);

                element.dispatchEvent(mouseUpEvent);
                element.dispatchEvent(clickEvent);
            }

            
            document.addEventListener('keydown', function(e) {
                const rebindedKey = mod.rebindings[e.keyCode];
                if (rebindedKey) {
                    e.preventDefault();
                    if (rebindedKey === 1) {
                        clickAtCurrentPosition();
                        return;
                    }
                    const newEvent = new KeyboardEvent('keydown', { keyCode: rebindedKey, which: rebindedKey });
                    document.dispatchEvent(newEvent);
                }
            });
            
            document.addEventListener('keyup', function(e) {
                const rebindedKey = mod.rebindings[e.keyCode];
                if (rebindedKey) {
                    e.preventDefault();
                    if (rebindedKey === 1) {
                        releaseAtCurrentPosition();
                        return;
                    }
                    const newEvent = new KeyboardEvent('keyup', { keyCode: rebindedKey, which: rebindedKey });
                    document.dispatchEvent(newEvent);
                }
            });
        },
        save:function(){
            return JSON.stringify(this.rebindings);
        },
        load:function(str){
            this.rebindings = JSON.parse(str);
        },
        setRebind:function(originalKeyCode, newKeyCode) {
            if (newKeyCode === 0) delete this.rebindings[originalKeyCode];
            else this.rebindings[originalKeyCode] = newKeyCode;
        }
    });
})();