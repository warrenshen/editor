import React from "react";

import Component from "app/templates/component";

import BlockDivider from "app/components/edit/block_divider";
import BlockHeading from "app/components/edit/block_heading";
import BlockImage from "app/components/edit/block_image";
import BlockQuote from "app/components/edit/block_quote";
import BlockStandard from "app/components/edit/block_standard";

import Section from "app/models/section";

import TypeConstants from "app/constants/type_constants";


class SectionStandard extends Component {

  // --------------------------------------------------
  // Defaults
  // --------------------------------------------------
  displayName() {
    return "SectionStandard";
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderBlock(block) {
    var props = {
      key: block.cid,
      block: block,
      updateStoryStyle: this.props.updateStoryStyle,
      updateStoryEditable: this.props.updateStoryEditable,
    };

    switch (block.get("type")) {
      case TypeConstants.block.divider:
        return <BlockDivider {...props} />;
      case TypeConstants.block.headingOne:
      case TypeConstants.block.headingTwo:
      case TypeConstants.block.headingThree:
        return <BlockHeading {...props} />;
      case TypeConstants.block.image:
        return <BlockImage {...props} />;
      case TypeConstants.block.quote:
        return <BlockQuote {...props} />;
      case TypeConstants.block.standard:
        return <BlockStandard {...props} />;
    }
  }

  renderBlocks() {
    return this.props.section.get("blocks").map(this.renderBlock, this);
  }

  render() {
    return (
      <section
        className={"section-container"}
        data-index={this.props.section.get("index")}>
        {this.renderBlocks()}
      </section>
    );
  }
}

SectionStandard.propTypes = {
  section: React.PropTypes.instanceOf(Section).isRequired,
  updateStoryStyle: React.PropTypes.func,
  updateStoryEditable: React.PropTypes.func,
};

SectionStandard.defaultProps = {
  section: new Section(),
  updateStoryStyle: null,
  updateStoryEditable: null,
};


module.exports = SectionStandard;
