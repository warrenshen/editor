import ClassNames from "classnames";
import React from "react";

import BlockComponent from "app/templates/block_component";


class BlockStandard extends BlockComponent {

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  render() {
    var block = this.props.block;
    var contentClass = ClassNames(
      { "block-content": true },
      { "block-centered": block.get("centered") },
      { "block-empty": !block.get("content") },
      { "general-placeholder": !block.get("content") }
    );
    return (
      <div
        className={"block-container"}
        data-index={block.get("index")}>
        <p
          className={contentClass}
          contentEditable={this.props.shouldEnableEdits}
          placeholder={"Write anything here..."}
          ref={"content"}>
        </p>
        {this.renderModal()}
      </div>
    );
  }
}


module.exports = BlockStandard;
