import { DROP_AREA_FLDST_ID } from '$lib/config/domConstants';

export function expressAnger() {
  const catBed = document.getElementById(DROP_AREA_FLDST_ID);
  if (!(catBed instanceof HTMLElement)) return;

  const scratch = document.createElement('div');
  const message = document.createElement('div');

  message.className =
    'bg-aura-darkpurple text-aura-red absolute -top-16 left-[10%] xl:left-[27%] rounded-md pointer-events-none border-b-2 p-1 text-center text-xs';
  message.innerHTML = ` '&!#%' Leave me alone! `;
  catBed.appendChild(message);

  scratch.className =
    'absolute top-1/2 left-1/2 h-40 w-40 pointer-events-none animate-reveal-diagonal transform -translate-x-1/2 -translate-y-1/2 z-[999]';
  scratch.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            class="w-full h-full">

                            <defs>
                                <!-- double the tile‐size -->
                                <pattern id="binaryPattern"
                                        patternUnits="userSpaceOnUse"
                                        width="108" height="98">
                                <rect width="108" height="98" fill="#000000"/>
                                <!-- double the font‐size and adjust the y‐position -->
                                <text x="0" y="58"
                                        font-family="monospace"
                                        font-size="58"
                                        fill="#06D001"
                                        opacity="0.6">
                                    1010
                                </text>
                                </pattern>
                            </defs>

                            <path
                                fill="url(#binaryPattern)"
                                d="M190.03 21.97c-.71-.003-1.422.01-2.124.03
                                c38.633 74.657 186.967 157.52 307.906 333.03
                                c-38.488-159.928-215.34-332.78-305.78-333.06z
                                M83.53 65.374c61.253 98.216 249.157 212.75 
                                375.75 378.844C420.49 283.03 173.3 62.907 
                                83.53 65.374m-67.31 81.313c59.365 87.324 
                                194.506 155.172 355.03 345.125c-38.792-161.19
                                -265.263-347.592-355.03-345.125" />
                        </svg>`;

  setTimeout(() => {
    catBed.appendChild(scratch);

    setTimeout(() => scratch.remove(), 7_000);
  }, 1000);

  setTimeout(() => message.remove(), 4_000);
}
