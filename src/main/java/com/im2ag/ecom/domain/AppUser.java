package com.im2ag.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * The User entity
 */
@Schema(description = "The User entity")
@Entity
@Table(name = "app_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AppUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "password")
    private String password;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "adresse")
    private String adresse;

    @JsonIgnoreProperties(value = { "lines", "appUser" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private UserOrder cart;

    @OneToMany(mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "lines", "appUser" }, allowSetters = true)
    private Set<UserOrder> orders = new HashSet<>();

    @OneToMany(mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "sells", "appUser" }, allowSetters = true)
    private Set<SalesPost> posts = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AppUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return this.email;
    }

    public AppUser email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public AppUser firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public AppUser lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return this.password;
    }

    public AppUser password(String password) {
        this.setPassword(password);
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public AppUser telephone(String telephone) {
        this.setTelephone(telephone);
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public AppUser adresse(String adresse) {
        this.setAdresse(adresse);
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public UserOrder getCart() {
        return this.cart;
    }

    public void setCart(UserOrder userOrder) {
        this.cart = userOrder;
    }

    public AppUser cart(UserOrder userOrder) {
        this.setCart(userOrder);
        return this;
    }

    public Set<UserOrder> getOrders() {
        return this.orders;
    }

    public void setOrders(Set<UserOrder> userOrders) {
        if (this.orders != null) {
            this.orders.forEach(i -> i.setAppUser(null));
        }
        if (userOrders != null) {
            userOrders.forEach(i -> i.setAppUser(this));
        }
        this.orders = userOrders;
    }

    public AppUser orders(Set<UserOrder> userOrders) {
        this.setOrders(userOrders);
        return this;
    }

    public AppUser addOrders(UserOrder userOrder) {
        this.orders.add(userOrder);
        userOrder.setAppUser(this);
        return this;
    }

    public AppUser removeOrders(UserOrder userOrder) {
        this.orders.remove(userOrder);
        userOrder.setAppUser(null);
        return this;
    }

    public Set<SalesPost> getPosts() {
        return this.posts;
    }

    public void setPosts(Set<SalesPost> salesPosts) {
        if (this.posts != null) {
            this.posts.forEach(i -> i.setAppUser(null));
        }
        if (salesPosts != null) {
            salesPosts.forEach(i -> i.setAppUser(this));
        }
        this.posts = salesPosts;
    }

    public AppUser posts(Set<SalesPost> salesPosts) {
        this.setPosts(salesPosts);
        return this;
    }

    public AppUser addPosts(SalesPost salesPost) {
        this.posts.add(salesPost);
        salesPost.setAppUser(this);
        return this;
    }

    public AppUser removePosts(SalesPost salesPost) {
        this.posts.remove(salesPost);
        salesPost.setAppUser(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppUser)) {
            return false;
        }
        return id != null && id.equals(((AppUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppUser{" +
            "id=" + getId() +
            ", email='" + getEmail() + "'" +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", password='" + getPassword() + "'" +
            ", telephone='" + getTelephone() + "'" +
            ", adresse='" + getAdresse() + "'" +
            "}";
    }
}
