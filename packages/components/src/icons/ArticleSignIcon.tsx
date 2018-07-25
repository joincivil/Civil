import * as React from "react";

export interface ArticleSignIconProps {
  color?: string;
}

export const ArticleSignIcon = (props: ArticleSignIconProps): JSX.Element => {
  const color = props.color || "#444444";
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs />
      <g id="Visual---Iteration-1.1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="17---Post-Page---Default-View" transform="translate(-1294.000000, -46.000000)">
          <g id="Gutenberg/Core/Publish-Title" transform="translate(160.000000, 32.000000)">
            <g id="Civil-Button-Open" transform="translate(1070.000000, 11.000000)">
              <g id="outline-how_to_reg-24px" transform="translate(64.000000, 3.000000)">
                <g id="Bounding_Boxes">
                  <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                </g>
                <g id="Outline" transform="translate(3.000000, 4.000000)" fill={color} fillRule="nonzero">
                  <g id="Group">
                    <path
                      d="M8,8 C10.21,8 12,6.21 12,4 C12,1.79 10.21,0 8,0 C5.79,0 4,1.79 4,4 C4,6.21 5.79,8 8,8 Z M8,2 C9.1,2 10,2.9 10,4 C10,5.1 9.1,6 8,6 C6.9,6 6,5.1 6,4 C6,2.9 6.9,2 8,2 Z"
                      id="Shape"
                    />
                    <path
                      d="M2,14 C2.2,13.37 4.57,12.32 6.96,12.06 L9,10.06 C8.61,10.02 8.32,10 8,10 C5.33,10 0,11.34 0,14 L0,16 L9,16 L7,14 L2,14 Z"
                      id="Shape"
                    />
                    <polygon id="Shape" points="17.6 8.5 12.47 13.67 10.4 11.59 9 13 12.47 16.5 19 9.91" />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
