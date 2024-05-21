type ApiAuctionOffer = {
  id: string;
  created_at: string;
  starting_bid: number;
  duration: number;
  user_sticker_id: string;
  user_sticker: ApiUserSticker;
  latest_bid: number;
};

type ApiAuctionBid = {
  id: string;
  created_at: string;
  bid: number;
  auction_offer_id: string;
  user_id: string;
  user: ApiUser;
};

type ApiAuctionEvent =
  | {
      type: "auction_event_created";
      payload: ApiAuctionOffer;
    }
  | {
      type: "auction_event_bid";
      payload: ApiAuctionBid;
    }
  | {
      type: "auction_event_completed";
      payload: {
        auction_offer_id: string;
        bid: number;
        user_id: string;
        winner: boolean;
      };
    };
