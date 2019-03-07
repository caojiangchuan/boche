package com.macxen.config.sercurity;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class WxAuthenticationToken extends AbstractAuthenticationToken {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String openId;
    private String accessToken;

    /**
     * Creates a token with the supplied array of authorities.
     *
     * @param authorities the collection of <tt>GrantedAuthority</tt>s for the principal
     *                    represented by this authentication object.
     */
    public WxAuthenticationToken(Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
    }

    public WxAuthenticationToken(String openId, String accessToken) {
        super(null);
        setAuthenticated(false);
        this.openId = openId;
        this.accessToken = accessToken;
    }


    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return openId;
    }
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        if (isAuthenticated) {
            throw new IllegalArgumentException(
                    "Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");
        }

        super.setAuthenticated(false);
    }

    public void eraseCredentials() {
        super.eraseCredentials();
        openId = null;
    }
}
