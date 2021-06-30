import { Component, render, h } from "preact";

export default class RelatedContent extends Component {
    render (props) {
        const cards = props.cards.map(v=> <div class="PartnerZoneLinks" dangerouslySetInnerHTML={{__html: v.content}}></div>)
        return (
            <div class="InnerFooter">
                {cards}
            </div>
        );
    }
}