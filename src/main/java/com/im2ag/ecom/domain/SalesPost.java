package com.im2ag.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SalesPost.
 */
@Entity
@Table(name = "sales_post")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SalesPost implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "price")
    private Float price;

    @Column(name = "limit_date")
    private LocalDate limitDate;

    @JsonIgnoreProperties(value = { "images", "seller", "categories", "salespost" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Product product;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cart", "orders", "posts" }, allowSetters = true)
    private AppUser appUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SalesPost id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStock() {
        return this.stock;
    }

    public SalesPost stock(Integer stock) {
        this.setStock(stock);
        return this;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Float getPrice() {
        return this.price;
    }

    public SalesPost price(Float price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public LocalDate getLimitDate() {
        return this.limitDate;
    }

    public SalesPost limitDate(LocalDate limitDate) {
        this.setLimitDate(limitDate);
        return this;
    }

    public void setLimitDate(LocalDate limitDate) {
        this.limitDate = limitDate;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public SalesPost product(Product product) {
        this.setProduct(product);
        return this;
    }

    public AppUser getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public SalesPost appUser(AppUser appUser) {
        this.setAppUser(appUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SalesPost)) {
            return false;
        }
        return id != null && id.equals(((SalesPost) o).id);
    }

    @Override
    public int hashCode() {
        // see
        // https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SalesPost{" +
                "id=" + getId() +
                ", stock=" + getStock() +
                ", price=" + getPrice() +
                ", limitDate='" + getLimitDate() + "'" +
                "}";
    }
}
